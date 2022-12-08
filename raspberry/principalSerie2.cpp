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

#include "ArduinoConnection/ArduinoConnection.hpp"
#include "ArduinoConnection/CallSensors.hpp"
#include "ArduinoConnection/CallOutputs.hpp"
#include "ArduinoConnection/ArduinoCall.hpp"
#include "BDconnection/BDconnection.hpp"
#include "HTTPcalls/HTTPcall.hpp"
#include "HTTPcalls/GetLastAction.hpp"
#include "HTTPcalls/GetActualizationTime.hpp"
#include "HTTPcalls/PostMeasurement.hpp"
#include <unistd.h>

void waitSleep(time_t actual, int secondsToWait)
{
    time_t remaining = secondsToWait - (time(NULL) - actual);
    if (remaining > 0)
    {
        if (remaining > 1)
            sleep(remaining - 1);
        while (time(NULL) < (actual + secondsToWait))
        {
        }
    }
}

char *getActualDate(char *dateString)
{
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    sprintf(dateString, "%d-%02d-%02dT%02d:%02d:%02dZ", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    return dateString;
}

void assert(int expression, char *msg)
{
    if (!expression)
    {
        printf("Fail assert, msg: %s", msg);
        printf("Exit of the program");
        exit(1);
    }
}

bool hasAlarm(Measurement measurement)
{
    if ((measurement.binary_values & 8) == false)
        return true; //!!!FIRE
    if (measurement.has_gas > 350)
        return true; //!!!flammable gas
    return false;
}

#define DEFAULT_ACTUALIZATION_ARDUINO 5

int main(void)
{
    int numRows = 0;
    char dateString[200];
    Measurement measurement;
    ArduinoConnection arduinoConnection((char *)"/dev/ttyACM0");
    assert(arduinoConnection.getIniciated(), strdup("Conexión de arduino no inicializada\n"));
    CallSensors callSensorsArduino(&arduinoConnection);
    CallOutputs callOutputsArduino(&arduinoConnection);
    BDconnection connectionBBDD((char *)"dbname = raspberryTest");
    assert(connectionBBDD.getConnection(), strdup("No se puede conectar a la base de datos\n")); // connect to bbdd
    char *identifier = strdup(""), *pass = strdup(""), *URL = strdup("");
    int secondsActualizationArduino = 0, secondsActualizationServer = 0;
    assert(connectionBBDD.getPlaceAtributes(&identifier, &pass, &URL, &secondsActualizationArduino, &secondsActualizationServer), strdup("Fallo al leer la tabla place"));

    printf("Atributos de la Raspberry: %s %s %s %d %d\n", identifier, pass, URL, secondsActualizationArduino, secondsActualizationServer);
    // connection.setPlaceActualizationTime(identifier, pass, URL, /*actualizationTime*/ 9, 10);
    GetLastAction getLastActionServer(identifier, pass, URL);
    GetActualizationTime getActualizationTimeServer(identifier, pass, URL);
    PostMeasurement postMeasurementServer(identifier, pass, URL);

    // set the last action
    int lastAction = connectionBBDD.getLastAction();
    assert(lastAction != -1, strdup("Fallo al leer la tabla de las acciones"));
    getLastActionServer.call();
    getActualizationTimeServer.call();
    while (!HTTPcall::allCallsCompleted())
    {
        // printf("Las llamadas sin terminar\n");
    }
    if (getActualizationTimeServer.getSuccess())
        secondsActualizationServer = getActualizationTimeServer.getActualizationTime();
    else
        secondsActualizationServer = DEFAULT_ACTUALIZATION_ARDUINO * 2;
    secondsActualizationArduino = DEFAULT_ACTUALIZATION_ARDUINO;
    if (secondsActualizationServer < secondsActualizationArduino)
        secondsActualizationArduino = secondsActualizationServer;
    printf("Actualización del servidor: %d\n", secondsActualizationServer);
    if (getLastActionServer.getSuccess())
    {
        assert(connectionBBDD.setLastAction(getLastActionServer.getAllAction(), getActualDate(dateString)), strdup("Fallo al insertar una acción"));
        printf("La ultima accion del servidor: %d %d %d %d %d\n",
               getLastActionServer.getAllAction(), getLastActionServer.getAction(0), getLastActionServer.getAction(1),
               getLastActionServer.getAction(2), getLastActionServer.getAction(3));
    }
    callOutputsArduino.callToArduino(lastAction);
    time_t seconds = time(NULL);
    time_t secondsLastInsert = seconds;
    time_t secondsLastInsertServer = seconds;
    while (true)
    {
        bool has_sended = false;
        bool to_send = false;
        waitSleep(seconds, secondsActualizationArduino);
        seconds = time(NULL);
        printf("Segundos pasados: %d\n", (int)(time(NULL) - secondsLastInsert));
        if (callSensorsArduino.callToArduino(secondsActualizationArduino))
        {
            measurement = {getActualDate(dateString), callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                           callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                           callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), 1};

            if ((((int)(time(NULL) - secondsLastInsertServer)) >= secondsActualizationServer) || hasAlarm(measurement))
            {
                to_send = true;
                secondsLastInsertServer = time(NULL);
                getLastActionServer.call();
                getActualizationTimeServer.call();
                postMeasurementServer.call(measurement);
                while (!HTTPcall::allCallsCompleted())
                {
                }
                if (getLastActionServer.getSuccess() && lastAction != getLastActionServer.getAllAction())
                {
                    lastAction = getLastActionServer.getAllAction();
                    assert(connectionBBDD.setLastAction(lastAction, getActualDate(dateString)), strdup("Fallo al insertar la última acción"));
                    callOutputsArduino.callToArduino(lastAction);
                }

                if (getActualizationTimeServer.getSuccess() && secondsActualizationServer != getActualizationTimeServer.getActualizationTime())
                {
                    printf("Actualizacion del servidor actualizado a %d\n", getActualizationTimeServer.getActualizationTime());
                    secondsActualizationServer = getActualizationTimeServer.getActualizationTime();
                    if (secondsActualizationServer < DEFAULT_ACTUALIZATION_ARDUINO)
                        secondsActualizationArduino = secondsActualizationServer;
                    else
                        secondsActualizationArduino = DEFAULT_ACTUALIZATION_ARDUINO;
                }
                if (!getLastActionServer.getSuccess())
                    printf("No se ha podido hacer la llamada de la ultima acción del servidor \n");
                if (!getActualizationTimeServer.getSuccess())
                    printf("No se ha podido hacer la llamada del tiempo de actualización del servidor\n");
                if (!postMeasurementServer.getSuccess())
                    printf("No se ha podido hacer la llamada del envío de datos al servidor\n");
                else
                    has_sended = true;
            }
            int aux = connectionBBDD.insertMeasurement(callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                                                       callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                                                       callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), has_sended, to_send);
            assert(aux, strdup("Fallo al insertar una medición"));
            numRows++;
            printf("Número de filas introducidas: %d\n", numRows);
        }
    }
    connectionBBDD.exitConnection();

    // to compile serial
    // gcc -Wall -o principalSerie2 principalSerie2.cpp HTTPcalls/PostMeasurement.cpp HTTPcalls/GetActualizationTime.cpp HTTPcalls/GetLastAction.cpp HTTPcalls/HTTPcall.cpp BDconnection/BDconnection.cpp ArduinoConnection/ArduinoCall.cpp ArduinoConnection/ArduinoConnection.cpp ArduinoConnection/CallOutputs.cpp ArduinoConnection/CallSensors.cpp  -I/usr/include/postgresql -lpq -lcurl -ljson-c

    // link para VPN
    // https://www.geeknetic.es/Guia/1998/Como-usar-y-configurar-OpenVPN.html

    // ejemplo de post no bloqueante:
    // https://everything.curl.dev/libcurl/examples/http-ul-nonblock

    return 0;
}