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
    // gcc -Wall -o principalSerie2 principalSerie2.cpp BDconnection/BDconnection.cpp ArduinoConnection/ArduinoCall.cpp ArduinoConnection/ArduinoConnection.cpp ArduinoConnection/CallOutputs.cpp ArduinoConnection/CallSensors.cpp  -I/usr/include/postgresql -lpq -lcurl

    // link para VPN
    // https://www.geeknetic.es/Guia/1998/Como-usar-y-configurar-OpenVPN.html

    // ejemplo de post no bloqueante:
    // https://everything.curl.dev/libcurl/examples/http-ul-nonblock

    return 0;
}