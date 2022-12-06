#ifndef GETACTIALIZATIONTIME_H
#define GETACTIALIZATIONTIME_H

#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>
#include "HTTPcall.hpp"

class GetActualizationTime : HTTPcall
{
    static int actualizationTime;
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<GetActualizationTime *>(p)->handle_impl(data, size, nmemb);
    }
    size_t handle_impl(void *buffer, size_t size, size_t nmemb);
    static bool success;

public:
    bool getSuccess()
    {
        return GetActualizationTime::success;
    }
    GetActualizationTime(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url)
    {
        GetActualizationTime::actualizationTime = 0;
    }
    int getActualizationTime()
    {
        return GetActualizationTime::actualizationTime;
    }
    bool call();
};

#endif
