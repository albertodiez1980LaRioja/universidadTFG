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
    static bool success;

public:
    static CURLM *multi_handle;
    static char *token;
    HTTPcall(char *identifier, char *pass, char *url);
    char *getToken();
    bool getSuccess()
    {
        return HTTPcall::success;
    }
    static bool allCallsCompleted()
    {
        int still_running = 0;
        if (multi_handle != NULL)
        {
            CURLMsg *msg = NULL;
            int msgs_left;
            CURL *hnd = NULL;
            CURLcode return_code;
            curl_multi_perform(multi_handle, &still_running);
            while ((msg = curl_multi_info_read(multi_handle, &msgs_left)))
            {
                if (msg->msg == CURLMSG_DONE)
                {
                    hnd = msg->easy_handle;

                    return_code = msg->data.result;
                    if (return_code != CURLE_OK)
                    {
                        fprintf(stderr, "CURL error code: %d\n", msg->data.result);
                        continue;
                    }

                    curl_multi_remove_handle(multi_handle, hnd);
                    curl_easy_cleanup(hnd);
                    hnd = NULL;
                }
                else
                {
                    fprintf(stderr, "error: after curl_multi_info_read(), CURLMsg=%d\n", msg->msg);
                }
            }
        }
        else
            printf("No inicializado\n");
        if (still_running)
            return false;
        return true;
    }
};

#endif