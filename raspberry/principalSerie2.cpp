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

int main(void)
{
    int numRows = 0;
    char dateString[200];
    Measurement measurement;
    ArduinoConnection arduinoConnection((char *)"/dev/ttyACM0");
    CallSensors callSensorsArduino(&arduinoConnection);
    CallOutputs callOutputsArduino(&arduinoConnection);
    BDconnection connectionBBDD((char *)"dbname = raspberryTest");
    connectionBBDD.getConnection(); // connect to bbdd
    char *identifier = strdup(""), *pass = strdup(""), *URL = strdup("");
    int actualizationTime = 0, actualizationServerTime = 0;
    connectionBBDD.getPlaceAtributes(&identifier, &pass, &URL, &actualizationTime, &actualizationServerTime);

    printf("Atributos de la Raspberry: %s %s %s %d %d\n", identifier, pass, URL, actualizationTime, actualizationServerTime);
    // connection.setPlaceActualizationTime(identifier, pass, URL, /*actualizationTime*/ 9, 10);
    GetLastAction getLastActionServer(identifier, pass, URL);
    GetActualizationTime getActualizationTimeServer(identifier, pass, URL);
    PostMeasurement postMeasurementServer(identifier, pass, URL);

    // set the last action
    int lastAction = connectionBBDD.getLastAction();
    getLastActionServer.call();
    while (!HTTPcall::allCallsCompleted())
    {
        // printf("Las llamadas sin terminar\n");
    }
    connectionBBDD.setLastAction(getLastActionServer.getAllAction(), getActualDate(dateString));
    printf("La ultima accion del servidor: %d %d %d %d %d\n",
           getLastActionServer.getAllAction(), getLastActionServer.getAction(0), getLastActionServer.getAction(1),
           getLastActionServer.getAction(2), getLastActionServer.getAction(3));

    callOutputsArduino.callToArduino(lastAction);
    // get sensors
    if (callSensorsArduino.callToArduino())
    {
        connectionBBDD.insertMeasurement(callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                                         callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                                         callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), false);
        measurement = {getActualDate(dateString), callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                       callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                       callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), 1};
    }

    time_t seconds = time(NULL);
    time_t secondsLastInsert = seconds;
    time_t secondsLastInsertServer = seconds;
    while (true)
    {
        waitSleep(seconds, 5);
        seconds = time(NULL);
        printf("Segundos pasados: %d\n", (int)(time(NULL) - secondsLastInsert));
        if (((int)(time(NULL) - secondsLastInsertServer)) >= 10)
        {
            secondsLastInsertServer = time(NULL);
            getLastActionServer.call();
            postMeasurementServer.call(measurement);
            while (!HTTPcall::allCallsCompleted())
            {
            }
            if (lastAction != getLastActionServer.getAllAction())
            {
                lastAction = getLastActionServer.getAllAction();
                connectionBBDD.setLastAction(lastAction, getActualDate(dateString));
            }
            callOutputsArduino.callToArduino(lastAction);
        }
        if (callSensorsArduino.callToArduino())
        {
            measurement = {getActualDate(dateString), callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                           callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                           callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), 1};

            connectionBBDD.insertMeasurement(callSensorsArduino.getBinaryValues(), callSensorsArduino.getHasPersons(),
                                             callSensorsArduino.getHasSound(), callSensorsArduino.getHasGas(), callSensorsArduino.getHasOil(),
                                             callSensorsArduino.getHasRain(), callSensorsArduino.getTemperature(), callSensorsArduino.getHumidity(), false);

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