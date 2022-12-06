#include "BDconnection.hpp"
#include <netinet/in.h>
#include <arpa/inet.h>

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

int BDconnection::insertMeasurement(int binary_values, int has_persons, int has_sound, int has_gas, int has_oil, int has_rain, int temperature, int humidity, bool has_sended)
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
    if (has_sended)
        paramValues[8] = "true";
    else
        paramValues[8] = "false";

    res = PQexecParams(conn,
                       "INSERT INTO public.sensors( date_time, has_sended, binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity)  VALUES (NOW(), $9, $1, $2, $3, $4, $5, $6, $7,$8);",
                       9,    /* one param */
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

int BDconnection::setLastAction(int action, char *date)
{
    // INSERT INTO public.actions(date_time, binary_values) VALUES('', 0);
    const char *paramValues[10];
    char stringValue[100][100];
    // int numRows;
    sprintf(stringValue[0], "%s", date);
    paramValues[0] = stringValue[0];
    sprintf(stringValue[1], "%d", action);
    paramValues[1] = stringValue[1];

    res = PQexecParams(conn,
                       "INSERT INTO public.actions(date_time, binary_values) VALUES($1, $2);",
                       //"INSERT INTO public.actions( date_time, has_sended, binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity)  VALUES (NOW(), false, $1, $2, $3, $4, $5, $6, $7,$8);",
                       2,    /* one param */
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

int BDconnection::getPlaceAtributes(char **identifier, char **pass, char **URL, int *actualizationTime, int *actualization_server_time)
{
    // SELECT identifier, pass, url, actualizationtime FROM public.place;

    PGresult *res;
    res = PQexecParams(this->conn,
                       "SELECT identifier, pass, url,actualizationtime,actualization_server_time FROM public.place;",
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
        *identifier = PQgetvalue(res, 0, 0);
        *pass = PQgetvalue(res, 0, 1);
        *URL = PQgetvalue(res, 0, 2);
        *actualizationTime = ntohl(*((uint32_t *)PQgetvalue(res, 0, 3)));
        *actualization_server_time = ntohl(*((uint32_t *)PQgetvalue(res, 0, 4)));
        return 1;
    }
    else
        printf("No había datos para leer\n");
    return 1;
}

int BDconnection::setPlaceActualizationTime(char *identifier, char *pass, char *URL, int actualizationTime, int actualization_server_time)
{
    const char *paramValues[10];
    char stringValue[100][100];
    // int numRows;
    sprintf(stringValue[0], "%s", identifier);
    paramValues[0] = stringValue[0];
    sprintf(stringValue[1], "%s", pass);
    paramValues[1] = stringValue[1];
    sprintf(stringValue[2], "%s", URL);
    paramValues[2] = stringValue[2];
    sprintf(stringValue[3], "%d", actualizationTime);
    paramValues[3] = stringValue[3];
    sprintf(stringValue[4], "%d", actualization_server_time);
    paramValues[4] = stringValue[4];

    res = PQexecParams(conn,
                       "UPDATE public.place SET actualizationtime=$4, actualization_server_time=$5 WHERE identifier=$1 and pass=$2 and url=$3;",
                       5,    /* one param */
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
