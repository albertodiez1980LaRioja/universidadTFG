#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>

static size_t write_data(void *buffer, size_t size, size_t nmemb, void *userp)
{
    struct json_object *parsed_json;
    struct json_object *data;
    struct json_object *action;
    printf("Contenido: %s\n", (char *)buffer);

    parsed_json = json_tokener_parse((char *)buffer);
    json_object_object_get_ex(parsed_json, "data", &data);
    int numActions = json_object_array_length(data);
    printf("Número de acciones: %d\n", numActions);
    for (int i = 0; i < numActions; i++)
    {
        struct json_object *date;
        struct json_object *output;
        struct json_object *value;
        action = json_object_array_get_idx(data, i);
        json_object_object_get_ex(action, "date", &date);
        json_object_object_get_ex(action, "outputId", &output);
        json_object_object_get_ex(action, "value", &value);
        printf("Fecha: %s output: %d value: %s\n", json_object_get_string(date),
               json_object_get_int(output), json_object_get_string(value));
        // queda meter esto en una estructura o en su clase, también mandar las mediciones
    }

    return size * nmemb;
}

int main(void)
{
    CURL *curl;
    // CURLcode res;
    CURLM *multi_handle;
    struct curl_slist *headers = NULL;
    char token[] = "x-access-token-place: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoxLCJkbmkiOiIxNjYwMzU0MSIsIm5hbWUiOiJBbmRyZWEgVmFsZGVycmFtYTMiLCJ1c2VyX25hbWUiOiJBbGJlcnRvIiwicGFzcyI6IiQyYiQxMCRGcXlYNGlsSXNweEk4MlVmVm9uenQuMUdYemZjalRPLmF4enljZTFjNUNaRjBaSjFXRGVBZSIsInRlbGVwaG9uZSI6IjIyMiIsImNlbHVsYXIiOiIyMjIyIiwiYWRkcmVzcyI6IkdyYW4gdsOtYSIsImVtYWlsIjoiYWEyQHlhaG9vLmNvbSIsInJvbGVzIjoyfSwiaWF0IjoxNjY5OTEwNTQ1LCJleHAiOjE2NzAwODMzNDV9.aptrE1KUsMpXT9ws2C6CGc-8XjKp8LnX5BHUBluW5bY"; // your actual token
    int still_running = 0;
    curl = curl_easy_init();
    multi_handle = curl_multi_init();
    if (curl && multi_handle)
    {
        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/api/actions/place/1");
        /* example.com is redirected, so we tell libcurl to follow redirection */
        // curl_easy_setopt(curl, CURLOPT_CONNECT_ONLY, 1L);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        headers = curl_slist_append(headers, token);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        /* Perform the request, res will get the return code */
        printf("Se llama\n");
        // res = curl_easy_perform(curl);
        curl_multi_add_handle(multi_handle, curl);

        printf("Se ha llamado\n");
        do
        {
            CURLMcode mc = curl_multi_perform(multi_handle, &still_running);

            if (still_running)
                /* wait for activity, timeout or "nothing" */
                mc = curl_multi_poll(multi_handle, NULL, 0, 1000, NULL);

            if (mc)
                break;
        } while (still_running);
        curl_multi_cleanup(multi_handle);
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }
    return 0;
    // to compile
    // gcc -Wall -o pruebaCurl pruebaCurl.cpp -I/usr/include/postgresql -lpq -lcurl -ljson-c
}