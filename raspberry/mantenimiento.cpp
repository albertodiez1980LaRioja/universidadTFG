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

#include "BDconnection/BDconnection.hpp"
#include "HTTPcalls/HTTPcall.hpp"
#include "HTTPcalls/GetLastAction.hpp"
#include "HTTPcalls/GetActualizationTime.hpp"
#include "HTTPcalls/PostMeasurement.hpp"
#include <unistd.h>

void assert(int expression, char *msg)
{
    if (!expression)
    {
        printf("Fail assert, msg: %s", msg);
        printf("Exit of the program");
        exit(1);
    }
}

int main()
{
    int numRows = 0;
    Measurement measurements[10];
    BDconnection connectionBBDD((char *)"dbname = postgres");
    assert(connectionBBDD.getConnection(), strdup("No se puede conectar a la base de datos\n")); // connect to bbdd
    char *identifier = strdup(""), *pass = strdup(""), *URL = strdup("");
    int secondsActualizationArduino = 0, secondsActualizationServer = 0;
    assert(connectionBBDD.getPlaceAtributes(&identifier, &pass, &URL, &secondsActualizationArduino, &secondsActualizationServer), strdup("Fallo al leer la tabla place"));

    printf("Atributos de la Raspberry: %s %s %s %d %d\n", identifier, pass, URL, secondsActualizationArduino, secondsActualizationServer);
    // connection.setPlaceActualizationTime(identifier, pass, URL, /*actualizationTime*/ 9, 10);
    PostMeasurement postMeasurementServer(identifier, pass, URL);

    while (true)
    {
        assert(connectionBBDD.DeleteLastActions() != -1, strdup("Fallo al eliminar las últimas acciones\n"));
        assert(connectionBBDD.DeleteLastMeasurements() != -1, strdup("Fallo al eliminar las últimas mediciones\n"));
        numRows = connectionBBDD.getMeasurementsNotSended(measurements);
        if (numRows > 0)
            printf("Número de mediciones para enviar: %d\n", numRows);
        if (numRows > 0)
        {
            postMeasurementServer.callMultiMeasurement(measurements, numRows);
            if (postMeasurementServer.getSuccess())
            {
                connectionBBDD.setMeasurementsToSended(measurements, numRows);
            }
            else
            {
                printf("No enviados\n");
                sleep(1);
            }
        }
        else
        {
            sleep(1);
        }
    }

    return 1;
}

// to compile
// gcc -Wall -o mantenimiento mantenimiento.cpp HTTPcalls/PostMeasurement.cpp HTTPcalls/GetActualizationTime.cpp HTTPcalls/GetLastAction.cpp HTTPcalls/HTTPcall.cpp BDconnection/BDconnection.cpp -I/usr/include/postgresql -lpq -lcurl -ljson-c