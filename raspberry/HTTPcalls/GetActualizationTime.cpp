#include "GetActualizationTime.hpp"

int GetActualizationTime::actualizationTime = 0;

size_t GetActualizationTime::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *place;
    struct json_object *actualizationTime;
    struct json_object *parsed_json;
    parsed_json = json_tokener_parse((char *)buffer);
    json_object_object_get_ex(parsed_json, "place", &place);
    json_object_object_get_ex(place, "actualizationTime", &actualizationTime);
    this->actualizationTime = json_object_get_int(actualizationTime);
    return size * nmemb;
}

bool GetActualizationTime::call()
{
    this->curl = curl_easy_init();
    if (!this->curl)
        return false;
    char aux[2000];
    char auxURL[2000];
    int still_running;
    struct curl_slist *headers = NULL;
    sprintf(auxURL, "%s%s", this->url, "/api/places/actualization");
    curl_easy_setopt(this->curl, CURLOPT_URL, auxURL);
    curl_easy_setopt(this->curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(this->curl, CURLOPT_WRITEFUNCTION, &GetActualizationTime::handle);
    sprintf(aux, "x-access-token: %s", this->getToken());
    headers = curl_slist_append(headers, aux);
    curl_easy_setopt(this->curl, CURLOPT_HTTPHEADER, headers);
    curl_multi_add_handle(this->multi_handle, curl);
    curl_multi_perform(this->multi_handle, &still_running);
    return true;
}
