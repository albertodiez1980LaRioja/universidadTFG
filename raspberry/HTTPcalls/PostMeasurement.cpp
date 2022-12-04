#include "PostMeasurement.hpp"

bool PostMeasurement::success = false;

size_t PostMeasurement::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *message;
    struct json_object *parsed_json;
    PostMeasurement::success = false;
    parsed_json = json_tokener_parse((char *)buffer);
    if (json_object_object_get_ex(parsed_json, "message", &message))
        if (!strcmp("PostMeasurement::", json_object_get_string(message)))
            PostMeasurement::success = true;
    // printf("El mensaje es: %s\n", json_object_get_string(message));
    PostMeasurement::success = true;
    return size * nmemb;
}

bool PostMeasurement::call(char *dateString, int binary_values, int has_persons, int has_sound, int has_gas, int has_oil,
                           int has_rain, int temperature, int humidity, int placeId)
{
    if (!curl)
        return false;
    char aux[2000];
    char auxURL[2000];
    int still_running;
    struct curl_slist *headers = NULL;
    sprintf(auxURL, "%s%s", this->url, "/api/measurements");
    curl_easy_setopt(this->curl, CURLOPT_URL, auxURL);
    curl_easy_setopt(this->curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(this->curl, CURLOPT_WRITEFUNCTION, &PostMeasurement::handle);
    // to large packets
    curl_easy_setopt(this->curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
    sprintf(aux, "x-access-token: %s", this->getToken());
    headers = curl_slist_append(headers, aux);
    curl_slist_append(headers, "Accept: application/json");
    curl_slist_append(headers, "Content-Type: application/json");
    curl_slist_append(headers, "charset: utf-8");
    curl_slist_append(headers, "enctype: multipart/form-data");
    curl_easy_setopt(this->curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(this->curl, CURLOPT_POST, 1L);
    char buffer[1000] = "{ \"date_time\": \"2022-05-28T10:51:24Z\",\"binary_values\": 1000,\"has_persons\": 1000,\"has_sound\": 0,\"has_gas\": 0,\"has_oil\": 0,\"has_rain\": 0,\"temperature\": 0,\"humidity\": 0,\"place_id: 1\" } ";
    sprintf(buffer, "{ \"date_time\": \"%s\",\"binary_values\": %d,\"has_persons\": %d,\"has_sound\": %d,\"has_gas\": %d,\"has_oil\": %d,\"has_rain\": %d,\"temperature\": %d,\"humidity\": %d,\"placeId\": %d }",
            dateString, binary_values, has_persons, has_sound, has_gas, has_oil,
            has_rain, temperature, humidity, placeId);
    printf("buffer: %s\n", buffer);
    curl_easy_setopt(this->curl, CURLOPT_POSTFIELDS, buffer);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (long)strlen(buffer));
    curl_multi_add_handle(this->multi_handle, this->curl);
    curl_multi_perform(this->multi_handle, &still_running);
    return true;
}
