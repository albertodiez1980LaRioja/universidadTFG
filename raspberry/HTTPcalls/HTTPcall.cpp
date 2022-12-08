

#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>
#include "HTTPcall.hpp"

static size_t
loadToken(void *buffer, size_t size, size_t nmemb, void *userp)
{
    struct json_object *parsed_json;
    struct json_object *data;
    parsed_json = json_tokener_parse((char *)buffer);
    if (json_object_object_get_ex(parsed_json, "token", &data))
    {
        HTTPcall::token = strdup(json_object_get_string(data));
    }
    else
        printf("\nFail at search token\n");
    return size * nmemb;
}

HTTPcall::HTTPcall(char *identifier, char *pass, char *url)
{
    // this->curl = curl_easy_init(); // need to inizialice each time
    this->url = url;
    this->identifier = identifier;
    this->pass = pass;
    if (this->multi_handle == NULL)
    {
        this->curlToken = curl_easy_init();
        this->multi_handle = curl_multi_init();
        this->seconds = time(NULL);
        // load the token sincronus
        this->token = this->loadTokenPlace(identifier, pass);
        HTTPcall::allCallsCompleted();
    }
}

char *HTTPcall::loadTokenPlace(char *identifier, char *pass)
{
    struct curl_slist *headers = NULL;
    char auxURL[2000];
    sprintf(auxURL, "%s%s", this->url, "/api/places/authenticate");
    curl_easy_setopt(curlToken, CURLOPT_URL, auxURL);
    curl_easy_setopt(curlToken, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curlToken, CURLOPT_WRITEFUNCTION, loadToken);
    headers = curl_slist_append(headers, "Accept: application/json");
    curl_slist_append(headers, "Content-Type: application/json");
    curl_slist_append(headers, "charset: utf-8");
    curl_easy_setopt(curlToken, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curlToken, CURLOPT_POST, 1L);
    char buffer[200] = "{ \"identifier\" : \"aaabaa\" , \"pass\" : \"abc\" }             ";
    sprintf(buffer, "{ \"identifier\" : \"%s\" , \"pass\" : \"%s\" }", identifier, pass);
    curl_easy_setopt(curlToken, CURLOPT_POSTFIELDS, buffer);
    CURLcode res = curl_easy_perform(curlToken);
    if (res == CURLE_OK)
    {
        return HTTPcall::token;
    }
    return NULL;
}

char *HTTPcall::getToken()
{
    // this->token = this->loadTokenPlace(identifier, pass);
    if (((time(NULL) - this->seconds) > 3600) || this->token == NULL)
    {
        this->seconds = time(NULL);
        this->token = this->loadTokenPlace(identifier, pass);
    }
    return this->token;
}

// inicialize static
char *HTTPcall::token = NULL;
CURLM *HTTPcall::multi_handle = NULL;
CURLM *HTTPcall::curlToken = NULL;
char *HTTPcall::identifier = NULL;
char *HTTPcall::pass = NULL;
time_t HTTPcall::seconds = 0;
