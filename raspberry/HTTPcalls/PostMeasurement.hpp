#ifndef POSTMEASUREMENT_H
#define POSTMEASUREMENT_H

#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>
#include "HTTPcall.hpp"

class PostMeasurement : HTTPcall
{
    static bool success;
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<PostMeasurement *>(p)->handle_impl(data, size, nmemb);
    }
    static size_t handle_impl(void *buffer, size_t size, size_t nmemb);

public:
    bool getSuccess()
    {
        return PostMeasurement::success;
    }
    PostMeasurement(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url) {}
    bool call(char *dateString, int binary_values, int has_persons, int has_sound, int has_gas, int has_oil,
              int has_rain, int temperature, int humidity, int placeId);
};

#endif
