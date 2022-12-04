#ifndef POSTMEASUREMENT_H
#define POSTMEASUREMENT_H

#ifndef STRUCTMEASUREMENT_H
#define STRUCTMEASUREMENT_H
typedef struct
{
    char *date;
    int binary_values, has_persons, has_sound, has_gas, has_oil;
    int has_rain, temperature, humidity, placeId;
} Measurement;
#endif

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
    bool call(Measurement measurement);
    bool callMultiMeasurement(Measurement *measurements, int length);
};

#endif
