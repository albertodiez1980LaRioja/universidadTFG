#ifndef BDCONNECTION_H
#define BDCONNECTION_H

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

class BDconnection
{
    char *conninfo;
    PGconn *conn;
    PGresult *res;

    void exit_nicely(PGconn *conn)
    {
        PQfinish(conn);
        // exit(1);
    }

public:
    BDconnection(char *charConnection);
    PGresult *startTransaction(char *sentence);
    void endTransaction(PGconn *conn, PGresult *res);
    int insertMeasurement(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity, bool has_sended, bool to_send);
    int getLastAction();
    int setLastAction(int action, char *date);
    int getPlaceAtributes(char **identifier, char **pass, char **URL, int *actualizationTime, int *actualization_server_time);
    int setPlaceActualizationTime(char *identifier, char *pass, char *URL, int actualizationTime, int actualization_server_time);
    int getConnection();
    void exitConnection();
};

#endif