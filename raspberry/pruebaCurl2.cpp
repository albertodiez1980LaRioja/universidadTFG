#include "HTTPcalls/HTTPcall.hpp"
#include "HTTPcalls/GetLastAction.hpp"
#include "HTTPcalls/GetActualizationTime.hpp"
#include "HTTPcalls/PostMeasurement.hpp"

int main()
{
    GetLastAction getLastAction(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    GetActualizationTime getActualizationTime(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    PostMeasurement postMeasurement(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    getLastAction.call();
    getActualizationTime.call();
    char dateString[200];
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    sprintf(dateString, "%d-%02d-%02dT%02d:%02d:%02dZ", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    postMeasurement.call(dateString, 2, 2, 2, 2, 2, 2, 2, 2, 1);
    while (!HTTPcall::allCallsCompleted())
    {
        // printf("Las llamadas sin terminar\n");
    }
    printf("Todas las llamadas terminadas\n");
    for (int i = 0; i < getLastAction.getNumActions(); i++)
    {
        if (getLastAction.getAction(i))
            printf("Accion: %d es true\n", i);
        else
            printf("Accion: %d es false\n", i);
    }
    printf("Tiempo de actualización: %d\n", getActualizationTime.getActualizationTime());
    if (postMeasurement.getSuccess())
        printf("Measurements grabados\n");
    else
        printf("Measurement no grabados\n");
    return 1;
}

// para compilar:
// gcc -Wall -o pruebaCurl2 pruebaCurl2.cpp HTTPcalls/PostMeasurement.cpp HTTPcalls/GetActualizationTime.cpp HTTPcalls/GetLastAction.cpp HTTPcalls/HTTPcall.cpp -I/usr/include/postgresql -lpq -lcurl -ljson-c