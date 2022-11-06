#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <libpq-fe.h>

class ArduinoConnection
{
    int state, pinCLK, pinOut, pinIn, lastRead;
    unsigned char bufferOut[500], bufferIn[500];
    int lenghtBufferIn, lenghtBufferOut;
    int nowBufferIn, actualBufferOut;
    int counter;
    int bitOUT, bitIN, bitCLK;
    int maskBit[8];
    int isIn;
    bool vibration, obstacle, light, fire, writeToBBDD;
    int binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity;

public:
    ArduinoConnection(int pinCLK, int pinOut, int pinIn);
    void wait();
    void calculateCheckSum(unsigned char *hightByte, unsigned char *lowByte, unsigned char *buffer, int lenght);
    int getBinaryValues() { return this->binary_values; };
    int getHasPersons() { return this->has_persons; };
    int getHasSound() { return this->has_sound; };
    int getHasGas() { return this->has_gas; };
    int getHasOil() { return this->has_oil; };
    int getHasRain() { return this->has_rain; };
    int getTemperature() { return this->temperature; };
    int getHumidity() { return this->humidity; };
    int getWriteToBDD() { return this->writeToBBDD; }
    void resetWriteToBBDD() { this->writeToBBDD = false; };
};

ArduinoConnection::ArduinoConnection(int pinCLK, int pinOut, int pinIn)
{
    this->writeToBBDD = false;
    this->isIn = 0;
    this->state = 0;
    this->pinCLK = pinCLK;
    this->pinOut = pinOut;
    this->pinIn = pinIn;
    this->lenghtBufferIn = 0;
    this->lenghtBufferOut = 0;
    this->nowBufferIn = 0;
    this->actualBufferOut = 0;
    if (pinCLK != -1)
    {
        pinMode(this->pinCLK, OUTPUT);
    }
    pinMode(this->pinOut, OUTPUT);
    pinMode(this->pinIn, INPUT);
    this->bitOUT = 0;
    this->bufferOut[0] = 170;
    this->bufferOut[1] = 5;
    this->bufferOut[2] = 0;
    this->calculateCheckSum(&this->bufferOut[3], &this->bufferOut[4], this->bufferOut, 5);
    // this->bufferOut[3] = 0;
    // this->bufferOut[4] = 175;
    this->maskBit[0] = 128;
    for (int i = 1; i < 8; i++)
        this->maskBit[i] = this->maskBit[i - 1] / 2;
    this->counter = 0;
}

void ArduinoConnection::calculateCheckSum(unsigned char *hightByte, unsigned char *lowByte, unsigned char *buffer, int lenght)
{
    int sum = 0;
    for (int i = 0; i < lenght - 2; i++)
    {
        sum += buffer[i];
    }
    *lowByte = sum % 128;
    *hightByte = sum / 128;
}

void ArduinoConnection ::wait()
{
    int msToDelay = 1;
    if (this->pinCLK != -1)
    {
        this->state++;
        if (this->state == 1) // first send the packet to arduino
        {
            if (this->actualBufferOut < (this->lenghtBufferOut * 8)) // send the bit data
            {
                int numByte = this->actualBufferOut / 8;
                int numBit = this->actualBufferOut % 8;
                if (this->bufferOut[numByte] & this->maskBit[numBit])
                {
                    digitalWrite(this->pinOut, HIGH);
                }
                else
                {
                    digitalWrite(this->pinOut, LOW);
                }
                this->actualBufferOut++;
            }
            else
            {
                digitalWrite(this->pinOut, LOW);
            }
            if (this->bitCLK) // send the clock signal
            {
                digitalWrite(this->pinCLK, HIGH);
                this->bitCLK = 0;
            }
            else
            {
                digitalWrite(this->pinCLK, LOW);
                this->bitCLK = 1;
            }
            delay(msToDelay);
        }
        else if (this->state == 2) // receibe the data
        {
            delay(msToDelay);
            int read = digitalRead(this->pinIn);
            if (read == HIGH)
            {
                if (!isIn)
                {
                    for (int i = 0; i < 50; i++) // reset the buffer
                        bufferIn[i] = 0;
                    nowBufferIn = 0;
                    this->lenghtBufferIn = 2;
                }
                isIn = 1;
            }
            else
            {
                // printf("Detectado nivel bajo %d\n",read);
            }
            if (isIn)
            {
                if (this->nowBufferIn < (this->lenghtBufferIn * 8))
                {
                    int numByte = this->nowBufferIn / 8;
                    int numBit = this->nowBufferIn % 8;
                    if (read == HIGH)
                        bufferIn[numByte] = bufferIn[numByte] | maskBit[numBit];
                    if (this->nowBufferIn == 15)
                    {
                        if (bufferIn[0] != 170)
                        {
                            // esto funciona por que no se inicia hasta hacer un nuevo paquete, esto ocurre pasado 1 segundo de vuelta
                            // se podría mejorar bastante poniendo los bits en serie
                            printf("Fallo en el primer byte\n");
                            nowBufferIn = 0;
                            isIn = 0;
                            // damos por hecho que entre paquete y paquete recibido habrá por lo menos 1 byte a ceros, de esta forma funcionará
                            // también conviene que no haya ningún otro byte a 170
                        }
                        else
                            this->lenghtBufferIn = bufferIn[1];
                    }
                }

                if (this->nowBufferIn == this->lenghtBufferIn * 8 /*&& bufferIn[2] != 0*/)
                {
                    this->writeToBBDD = true;
                    printf("Paquete recibido: \n");
                    int sum = 0;
                    for (int i = 0; i < this->lenghtBufferIn; i++)
                    {
                        if (i < this->lenghtBufferIn - 1)
                            sum += bufferIn[i];
                        printf("byte ");
                        printf("%d ", i);
                        printf("%d\n", bufferIn[i]);
                    }
                    unsigned char byteHigh, byteLow;
                    calculateCheckSum(&byteHigh, &byteLow, bufferIn, lenghtBufferIn);
                    if (byteHigh == bufferIn[lenghtBufferIn - 2] && bufferIn[lenghtBufferIn - 1])
                    {
                        printf("Paquete con checksum correcto\n\n");
                        unsigned int inDigital = bufferIn[2];
                        this->binary_values = inDigital;
                        printf("Byte binarios %u\n", inDigital);
                        if (inDigital & 1)
                            printf("Hay vibración\n");
                        else
                            printf("No hay vibración\n");
                        if (inDigital & 2)
                            printf("No hay obtaculo\n");
                        else
                            printf("Hay obstaculo\n");
                        if ((inDigital & 4))
                            printf("No luz\n");
                        else
                            printf("Hay luz\n");
                        if (inDigital & 8)
                            printf("No hay fuego\n");
                        else
                            printf("Hay fuego\n");
                        int personas = bufferIn[3] + bufferIn[4] * 128;
                        this->has_persons = personas;
                        if (personas > 350)
                            printf("Personas detectadas\n");
                        else
                            printf("Personas NO detectadas\n");
                        int sonido = bufferIn[5] + bufferIn[6] * 128;
                        this->has_sound = sonido;
                        if (sonido > 600)
                            printf("Sonido detectado\n");
                        else
                            printf("Sonido NO detectado\n");
                        int gas = bufferIn[7] + bufferIn[8] * 128;
                        this->has_gas = gas;
                        if (gas > 350)
                            printf("Gas detectado\n");
                        else
                            printf("Gas NO detectado\n");
                        int aceite = bufferIn[9] + bufferIn[10] * 128;
                        this->has_oil = aceite;
                        if (aceite < 500)
                            printf("Aceite detectado\n");
                        else
                            printf("Aceite NO detectado\n");
                        int lluvia = bufferIn[11] + bufferIn[12] * 128;
                        this->has_rain = lluvia;
                        if (lluvia < 500)
                            printf("Lluvia detectado\n");
                        else
                            printf("Lluvia NO detectado\n");
                        this->humidity = bufferIn[13];
                        printf("Humedad: %u\n", bufferIn[13]);
                        this->temperature = bufferIn[14];
                        printf("Temperatura: %u\n", bufferIn[14]);
                    }
                    else
                    {
                        printf("Paquete con checksum incorrecto\n\n");
                        this->writeToBBDD = false;
                    }
                    isIn = 0;
                }
                nowBufferIn++;
            }
            this->lastRead = read;
            this->state = 0;
        }
        delay(msToDelay);
        this->counter++;
        if (this->counter == 500)
        {
            this->counter = 0;
            this->actualBufferOut = 0;
            this->lenghtBufferOut = 5;
        }
    }
}

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
    BDconnection();
    PGresult *startTransaction(char *sentence);
    void endTransaction(PGconn *conn, PGresult *res);
    int insertRow(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity);
    PGconn *getConnection();
    void exitConnection();
};

BDconnection::BDconnection()
{
}

void BDconnection::exitConnection()
{
    PQfinish(conn);
}

PGconn *BDconnection::getConnection()
{
    // PGconn *conn;
    /* Make a connection to the database */
    this->conninfo = (char *)"dbname = postgres";
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

int BDconnection::insertRow(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity)
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
    // numRows = PQcmdTuples(res)[0];
    //  printf("Número de filas introducidas: %d\n", numRows);
    //   show_binary_results(res);

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
    wiringPiSetup();
    ArduinoConnection arduinoConnection(22, 23, 24);
    BDconnection connection;
    connection.getConnection(); // connect to bbdd

    while (true)
    {
        arduinoConnection.wait();
        if (arduinoConnection.getWriteToBDD())
        {
            connection.insertRow(arduinoConnection.getBinaryValues(), arduinoConnection.getHasPersons(),
                                 arduinoConnection.getHasSound(), arduinoConnection.getHasGas(), arduinoConnection.getHasOil(),
                                 arduinoConnection.getHasRain(), arduinoConnection.getTemperature(), arduinoConnection.getHumidity());
            arduinoConnection.resetWriteToBBDD();
            numRows++;
            printf("Número de filas introducidas: %d\n", numRows);
        }
    }
    connection.exitConnection();

    // gcc - Wall - o blink blink.c - lwiringPi
    // compilation
    // gcc -Wall -o principal principal.cpp -lwiringPi -I/usr/include/postgresql -lpq

    return 0;
}