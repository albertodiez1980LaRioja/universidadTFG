#include <stdio.h>
#include <stdlib.h>
#include <libpq-fe.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <curl/curl.h>

// for the serial I/O
#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include <linux/serial.h>
#include <sys/ioctl.h>
#include <sys/stat.h>

class ArduinoConnection
{
private:
    static ArduinoConnection *instance;

public:
    static ArduinoConnection *getInstance(char *name)
    {
        if (instance == NULL)
            instance = new ArduinoConnection(name);

        return instance;
    }
    int open_serial_port(char *name);
    int read_from_serial(int fd, char *buf, int lon);
    int fd;
    ArduinoConnection(char *name);
};

int ArduinoConnection::open_serial_port(char *name)
{
    int fd, bits;
    struct termios term;
    struct serial_struct kernel_serial_settings;

    if ((fd = open(name, O_RDWR | O_NONBLOCK | O_NOCTTY)) == -1)
    {
        fprintf(stderr, "open(%s) failed: %s\n", name, strerror(errno));
        return -1;
    }
    if (ioctl(fd, TIOCMGET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TCIOMGET)");
        return -1;
    }
    bits &= ~(TIOCM_DTR | TIOCM_RTS);
    if (ioctl(fd, TIOCMSET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TIOCMSET)");
        return -1;
    }
    sleep(1);
    tcflush(fd, TCIFLUSH);
    bits &= TIOCM_DTR;
    if (ioctl(fd, TIOCMSET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TIOCMSET)");
        return -1;
    }

    memset(&term, 0, sizeof(term));
    term.c_iflag = IGNBRK | IGNPAR;
    term.c_cflag = CS8 | CREAD | HUPCL | CLOCAL;
    cfsetospeed(&term, B9600);
    cfsetispeed(&term, B9600);
    if (tcsetattr(fd, TCSANOW, &term) < 0)
    {
        perror("tcsetattr()");
        return -1;
    }
    if (ioctl(fd, TIOCGSERIAL, &kernel_serial_settings) == 0)
    {
        kernel_serial_settings.flags |= ASYNC_LOW_LATENCY;
        ioctl(fd, TIOCSSERIAL, &kernel_serial_settings);
    }
    tcflush(fd, TCIFLUSH);

    return fd;
}

int ArduinoConnection::read_from_serial(int fd, char *buf, int lon)
{
    int n;

    while (1)
    {
        if ((n = read(fd, buf, lon)) == -1)
        {
            if (errno != EAGAIN)
            {
                fprintf(stderr, "read() failed: (%d) %s\n", errno, strerror(errno));
                return -1;
            }
            // errno == EAGAIN, loop around and read again
        }
        else
        {

            if (n > 0)
            {
                // printf("%c %d", buf[0], n);
                return n; // stop reading
            }
            // read 0 bytes, loop around an read again
        }
    }
}

ArduinoConnection::ArduinoConnection(char *name)
{
    this->fd = this->open_serial_port(name);
}

void delay(float millis)
{
    clock_t start_time = clock();
    while (clock() < start_time + ((CLOCKS_PER_SEC / 1000.) * millis))
    {
    }
}

class ArduinoCall
{
protected:
    ArduinoConnection *arduinoConnection;
    int binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity;

public:
    ArduinoCall(ArduinoConnection *arduinoConnection)
    {
        this->arduinoConnection = arduinoConnection;
    }
    int deserialize(char *buffer, int lenght);
    int getBinaryValues() { return this->binary_values; };
    int getHasPersons() { return this->has_persons; };
    int getHasSound() { return this->has_sound; };
    int getHasGas() { return this->has_gas; };
    int getHasOil() { return this->has_oil; };
    int getHasRain() { return this->has_rain; };
    int getTemperature() { return this->temperature; };
    int getHumidity() { return this->humidity; };

    bool callToArduino(int action) { return true; };
};

int ArduinoCall::deserialize(char *buffer, int lenght)
{
    // need change
    int aux[120];
    sscanf(buffer, "%d %d %d %d %d %d %d %d %d %d %d %d", &aux[0], &aux[1], &aux[2], &aux[3], &aux[4],
           &aux[5], &aux[6], &aux[7], &aux[8], &aux[9], &aux[10], &aux[11]);
    if (aux[11] != (aux[0] + aux[1] + aux[2] + aux[3] + aux[4] + aux[5] + aux[6] + aux[7] + aux[8] + aux[9] + aux[10]))
    {
        printf("Fail: %s\n", buffer);
        return 0;
    }
    this->has_persons = aux[0];
    this->has_sound = aux[2];
    this->has_gas = aux[4];
    this->has_rain = aux[6];
    this->has_oil = aux[5];
    this->temperature = aux[10];
    this->humidity = aux[9];
    this->binary_values = aux[1] + aux[3] * 2 + aux[7] * 4 + aux[8] * 8;
    return 1;
}

class CallSensors : public ArduinoCall
{
public:
    CallSensors(ArduinoConnection *Connection) : ArduinoCall(Connection)
    {
    }
    bool callToArduino()
    {
        int lenghtBufferIn = 500;
        char bufferIn[500];
        sleep(1);
        char toSend[] = "0 1 1 0 0 2     \n\0";
        printf("Se manda: %s", toSend);
        if ((write(this->arduinoConnection->fd, toSend, sizeof(toSend))) == -1)
        {
            fprintf(stderr, "write() failed: %s\n", strerror(errno));
            return false;
        }
        sleep(1);
        this->arduinoConnection->read_from_serial(this->arduinoConnection->fd, bufferIn, 500);
        if (this->deserialize(bufferIn, lenghtBufferIn))
        {
            printf("Paquete recibido: %s\n", bufferIn);
            printf("Paquete con checksum correcto\n\n");
            printf("Byte binarios %u\n", this->getBinaryValues());
            if (this->getBinaryValues() & 1)
                printf("Hay vibración\n");
            else
                printf("No hay vibración\n");
            if (this->getBinaryValues() & 2)
                printf("No hay obtaculo\n");
            else
                printf("Hay obstaculo\n");
            if ((this->getBinaryValues() & 4))
                printf("No luz\n");
            else
                printf("Hay luz\n");
            if (this->getBinaryValues() & 8)
                printf("No hay fuego\n");
            else
                printf("Hay fuego\n");
            if (this->getBinaryValues() > 350)
                printf("Personas detectadas\n");
            else
                printf("Personas NO detectadas\n");
            if (this->getBinaryValues() > 600)
                printf("Sonido detectado \n");
            else
                printf("Sonido NO detectado \n");
            if (this->getBinaryValues() > 350)
                printf("Gas detectado\n");
            else
                printf("Gas NO detectado\n");
            if (this->getBinaryValues() < 500)
                printf("Aceite detectado\n");
            else
                printf("Aceite NO detectado\n");
            if (this->getBinaryValues() < 500)
                printf("Lluvia detectado\n");
            else
                printf("Lluvia NO detectado\n");
            printf("Humedad: %u\n", this->getHumidity());
            printf("Temperatura: %u\n", this->getTemperature());
        }
        else
        {
            printf("Paquete con checksum incorrecto\n\n");
            return false;
        }
        return true;
    }
};

class CallOutputs : public ArduinoCall
{
public:
    CallOutputs(ArduinoConnection *Connection) : ArduinoCall(Connection)
    {
    }
    bool callToArduino(int action)
    {
        int lenghtBufferIn = 500;
        char bufferIn[500];
        sleep(1);
        char activate = 1;
        char output1 = 0;
        char output2 = 0;
        char output3 = 0;
        char output4 = 0;
        char toSend[] = "1 1 1 0 0 0     \n\0";
        if (action != -1)
        {
            if (action & 0x01)
                output1 = 1;
            if (action & 0x02)
                output2 = 1;
            if (action & 0x04)
                output3 = 1;
            if (action & 0x08)
                output4 = 1;
        }
        toSend[0] = activate + '0';
        toSend[2] = output1 + '0';
        toSend[4] = output2 + '0';
        toSend[6] = output3 + '0';
        toSend[8] = output4 + '0';
        char checksum = activate + output1 + output2 + output3 + output4;
        toSend[10] = checksum + '0';
        printf("Se manda: %s", toSend);
        if ((write(this->arduinoConnection->fd, toSend, sizeof(toSend))) == -1)
        {
            fprintf(stderr, "write() failed: %s\n", strerror(errno));
            exit(EXIT_FAILURE);
        }
        sleep(1);
        this->arduinoConnection->read_from_serial(this->arduinoConnection->fd, bufferIn, 500);
        if (this->deserialize(bufferIn, lenghtBufferIn))
        {
            printf("Action updated:  %s\n", bufferIn);
            return 1;
        }
        printf("Fail to send action: %s\n", bufferIn);
        return 0;
    };
};

class BDconnection
{
    char *conninfo;
    PGconn *conn;
    PGresult *res;

    void exit_nicely(PGconn *conn)
    {
        PQfinish(conn);
        exit(1);
    }

public:
    BDconnection(char *charConnection);
    PGresult *startTransaction(char *sentence);
    void endTransaction(PGconn *conn, PGresult *res);
    int insertMeasurement(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity);
    int getLastAction();
    PGconn *getConnection();
    void exitConnection();
};

BDconnection::BDconnection(char *charConnection)
{
    this->conninfo = charConnection;
}

void BDconnection::exitConnection()
{
    PQfinish(conn);
}

PGconn *BDconnection::getConnection()
{
    // PGconn *conn;
    /* Make a connection to the database */
    // this->conninfo = (char *)"dbname = raspberryTest";
    //  this->conninfo = (char *)"dbname = postgres";
    this->conn = PQconnectdb(this->conninfo);

    /* Check to see that the backend connection was successfully made */
    if (PQstatus(conn) != CONNECTION_OK)
    {
        fprintf(stderr, "Connection to database failed: %s",
                PQerrorMessage(conn));
        this->exit_nicely(conn);
    }
    return conn;
}

int BDconnection::getLastAction()
{
    PGresult *res;
    res = PQexecParams(this->conn,
                       "SELECT date_time,binary_values FROM public.actions order by date_time desc limit 1",
                       0, /* no parameters */
                       NULL,
                       NULL,
                       NULL,
                       NULL,
                       1);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "SELECT failed: %s", PQerrorMessage(conn));
        PQclear(res);
        return -1;
    }
    if (PQntuples(res) > 0)
    {
        char *value = PQgetvalue(res, 0, 1);
        return ((*(int *)value) / 16777216);
    }
    else
        printf("No había datos para leer en las acciones\n");
    return 0;
}

int BDconnection::insertMeasurement(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity)
{
    /*
    INSERT INTO public.sensors(
                date_time, has_sended, binary_values, has_persons, has_sound,
                has_gas, has_oil, has_rain, temperature, humidity)
        VALUES (?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?);
    */
    const char *paramValues[10];
    char stringValue[100][100];
    // int numRows;
    sprintf(stringValue[0], "%d", binary_values);
    paramValues[0] = stringValue[0];
    sprintf(stringValue[1], "%d", has_persons);
    paramValues[1] = stringValue[1];
    sprintf(stringValue[2], "%d", has_sound);
    paramValues[2] = stringValue[2];
    sprintf(stringValue[3], "%d", has_gas);
    paramValues[3] = stringValue[3];
    sprintf(stringValue[4], "%d", has_oil);
    paramValues[4] = stringValue[4];
    sprintf(stringValue[5], "%d", has_rain);
    paramValues[5] = stringValue[5];
    sprintf(stringValue[6], "%d", temperature);
    paramValues[6] = stringValue[6];
    sprintf(stringValue[7], "%d", humidity);
    paramValues[7] = stringValue[7];

    res = PQexecParams(conn,
                       "INSERT INTO public.sensors( date_time, has_sended, binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity)  VALUES (NOW(), false, $1, $2, $3, $4, $5, $6, $7,$8);",
                       8,    /* one param */
                       NULL, /* let the backend deduce param type */
                       paramValues,
                       NULL, /* don't need param lengths since text */
                       NULL, /* default to all text params */
                       1);   /* ask for binary results */

    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "INSERT failed: %s", PQerrorMessage(conn));
        PQclear(res);
        this->exit_nicely(conn);
    }
    PQclear(res);
    return 1;
}

void BDconnection::endTransaction(PGconn *conn, PGresult *res)
{
    PQclear(res);

    /* close the portal ... we don't bother to check for errors ... */
    res = PQexec(conn, "CLOSE myportal");
    PQclear(res);

    /* end the transaction */
    res = PQexec(conn, "END");
    PQclear(res);
}

PGresult *BDconnection::startTransaction(char *sentence)
{
    PGresult *res;
    /* Start a transaction block */
    res = PQexec(conn, "BEGIN");
    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "BEGIN command failed: %s", PQerrorMessage(conn));
        PQclear(res);
        this->exit_nicely(conn);
    }

    /*
     * Should PQclear PGresult whenever it is no longer needed to avoid memory
     * leaks
     */
    PQclear(res);

    /*
     * Fetch rows from pg_database, the system catalog of databases
     */
    // res = PQexec(conn, "DECLARE myportal CURSOR FOR select * from pg_database");
    // res = PQexec(conn, "DECLARE myportal CURSOR FOR select * from public.sensors");
    res = PQexec(conn, sentence);
    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "DECLARE CURSOR failed: %s", PQerrorMessage(conn));
        PQclear(res);
        this->exit_nicely(conn);
    }
    PQclear(res);

    res = PQexec(conn, "FETCH ALL in myportal");
    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "FETCH ALL failed: %s", PQerrorMessage(conn));
        PQclear(res);
        this->exit_nicely(conn);
    }
    return (res);
}

int main(void)
{
    int numRows = 0;
    ArduinoConnection arduinoConnection((char *)"/dev/ttyACM0");
    CallSensors callSensors(&arduinoConnection);
    CallOutputs callOutputs(&arduinoConnection);
    BDconnection connection((char *)"dbname = raspberryTest");

    connection.getConnection(); // connect to bbdd
    int lastAction = 999;
    while (true)
    {
        int auxAction = connection.getLastAction();
        if (lastAction != auxAction)
        {
            if (callOutputs.callToArduino(auxAction))
                lastAction = auxAction;
        }
        if (callSensors.callToArduino())
        {
            connection.insertMeasurement(callSensors.getBinaryValues(), callSensors.getHasPersons(),
                                         callSensors.getHasSound(), callSensors.getHasGas(), callSensors.getHasOil(),
                                         callSensors.getHasRain(), callSensors.getTemperature(), callSensors.getHumidity());

            numRows++;
            printf("Número de filas introducidas: %d\n", numRows);
        }
    }
    // connection.exitConnection();

    // to compile serial
    // gcc -Wall -o principalSerie principalSerie.cpp -I/usr/include/postgresql -lpq -lcurl

    // link para VPN
    // https://www.geeknetic.es/Guia/1998/Como-usar-y-configurar-OpenVPN.html

    // ejemplo de post no bloqueante:
    // https://everything.curl.dev/libcurl/examples/http-ul-nonblock

    return 0;
}