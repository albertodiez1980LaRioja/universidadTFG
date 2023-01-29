#include "HTTPcalls/HTTPcall.hpp"
#include "HTTPcalls/GetLastAction.hpp"
#include "HTTPcalls/GetActualizationTime.hpp"
#include "HTTPcalls/PostMeasurement.hpp"
#include <unistd.h>

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
    Measurement measurement = {dateString, 2, 200, 2, 2, 2, 2, 2, 1, 1};
    sleep(1);
    t = time(NULL);
    tm = *localtime(&t);
    char dateString2[200];
    sprintf(dateString2, "%d-%02d-%02dT%02d:%02d:%02dZ", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    Measurement measurement2 = {dateString2, 3, 200, 2, 2, 2, 2, 2, 1, 1};
    sleep(1);
    t = time(NULL);
    tm = *localtime(&t);
    char dateString3[200];
    sprintf(dateString3, "%d-%02d-%02dT%02d:%02d:%02dZ", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    Measurement measurement3 = {dateString3, 4, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement4 = {dateString3, 5, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement5 = {dateString3, 6, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement6 = {dateString3, 7, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement7 = {dateString3, 8, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement8 = {dateString3, 9, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement9 = {dateString3, 10, 200, 2, 2, 2, 2, 2, 1, 1};
    Measurement measurement10 = {dateString3, 11, 200, 2, 2, 2, 2, 2, 1, 1};

    // postMeasurement.call(measurement);
    Measurement measurements[] = {measurement, measurement2, measurement3, measurement4, measurement5, measurement6, measurement7, measurement8, measurement9, measurement10};
    postMeasurement.callMultiMeasurement(measurements, 10);
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
// g++ -Wall -o pruebaCurl2 pruebaCurl2.cpp HTTPcalls/PostMeasurement.cpp HTTPcalls/GetActualizationTime.cpp HTTPcalls/GetLastAction.cpp HTTPcalls/HTTPcall.cpp -I/usr/include/postgresql -lpq -lcurl -ljson-c