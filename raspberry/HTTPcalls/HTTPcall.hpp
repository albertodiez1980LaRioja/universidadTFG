#ifndef HTTPCALL_H
#define HTTPCALL_H

#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>

class HTTPcall
{
    static time_t seconds;
    static char *identifier;
    static char *pass;
    static CURL *curlToken;
    char *loadTokenPlace(char *identifier, char *pass);

protected:
    CURL *curl;
    char *url;

public:
    static CURLM *multi_handle;
    static char *token;
    HTTPcall(char *identifier, char *pass, char *url);
    char *getToken();
    static bool allCallsCompleted()
    {
        int still_running = 0;
        if (multi_handle != NULL)
        {
            curl_multi_perform(multi_handle, &still_running);
        }
        else
            printf("No inicializado\n");
        if (still_running)
            return false;
        return true;
    }
};

#endif