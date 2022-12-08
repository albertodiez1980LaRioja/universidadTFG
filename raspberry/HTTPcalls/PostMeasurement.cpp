#include "PostMeasurement.hpp"

bool PostMeasurement::success = false;

size_t PostMeasurement::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *message;
    struct json_object *parsed_json;
    PostMeasurement::success = false;
    parsed_json = json_tokener_parse((char *)buffer);
    if (json_object_object_get_ex(parsed_json, "message", &message))
        if (!strcmp("Created succefully", json_object_get_string(message)))
            PostMeasurement::success = true;
    if (!PostMeasurement::success)
        HTTPcall::token = NULL;
    return size * nmemb;
}

bool PostMeasurement::call(Measurement measurement)
{
    this->curl = curl_easy_init();
    PostMeasurement::success = false;
    if (!this->curl)
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
            measurement.date, measurement.binary_values, measurement.has_persons, measurement.has_sound, measurement.has_gas, measurement.has_oil,
            measurement.has_rain, measurement.temperature, measurement.humidity, measurement.placeId);
    curl_easy_setopt(this->curl, CURLOPT_POSTFIELDS, buffer);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (long)strlen(buffer));
    curl_multi_add_handle(this->multi_handle, this->curl);
    // curl_multi_perform(this->multi_handle, &still_running);
    do
    {
        CURLMcode mc = curl_multi_perform(multi_handle, &still_running);
        if (!mc && still_running)
            /* wait for activity, timeout or "nothing" */
            mc = curl_multi_poll(multi_handle, NULL, 0, 1000, NULL);
        if (mc)
        {
            fprintf(stderr, "curl_multi_poll() failed, code %d.\n", (int)mc);
            break;
        }
        /* if there are still transfers, loop! */
    } while (still_running);
    return true;
}

// this is sync
bool PostMeasurement::callMultiMeasurement(Measurement *measurements, int length)
{
    PostMeasurement::success = false;
    this->curl = curl_easy_init();
    if (!this->curl)
        return false;
    char aux[2000];
    char auxURL[2000];
    int still_running;
    struct curl_slist *headers = NULL;
    sprintf(auxURL, "%s%s", this->url, "/api/measurements/multiple");
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
    char finalBuffer[6000];
    char allBuffer[3000] = "";
    char buffer[2000] = "{ \"date_time\": \"2022-05-28T10:51:24Z\",\"binary_values\": 1000,\"has_persons\": 1000,\"has_sound\": 0,\"has_gas\": 0,\"has_oil\": 0,\"has_rain\": 0,\"temperature\": 0,\"humidity\": 0,\"place_id: 1\" } ";
    if (length > 0)
    {
        sprintf(buffer, "{\"mesaurements\":[{ \"date_time\": \"%s\",\"binary_values\": %d,\"has_persons\": %d,\"has_sound\": %d,\"has_gas\": %d,\"has_oil\": %d,\"has_rain\": %d,\"temperature\": %d,\"humidity\": %d,\"placeId\": %d }",
                measurements[0].date, measurements[0].binary_values, measurements[0].has_persons, measurements[0].has_sound, measurements[0].has_gas, measurements[0].has_oil,
                measurements[0].has_rain, measurements[0].temperature, measurements[0].humidity, measurements[0].placeId);
        strcat(allBuffer, buffer);
    }
    else
        printf("No hay longitud\n");
    for (int i = 1; i < length; i++)
    {
        sprintf(buffer, ",{ \"date_time\": \"%s\",\"binary_values\": %d,\"has_persons\": %d,\"has_sound\": %d,\"has_gas\": %d,\"has_oil\": %d,\"has_rain\": %d,\"temperature\": %d,\"humidity\": %d,\"placeId\": %d }",
                measurements[i].date, measurements[i].binary_values, measurements[i].has_persons, measurements[i].has_sound, measurements[i].has_gas, measurements[i].has_oil,
                measurements[i].has_rain, measurements[i].temperature, measurements[i].humidity, measurements[i].placeId);
        strcat(allBuffer, buffer);
    }

    sprintf(finalBuffer, "%s %s", allBuffer, " ]}     ");
    // printf("buffer: %s\n", finalBuffer);
    curl_easy_setopt(this->curl, CURLOPT_POSTFIELDS, finalBuffer);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (long)strlen(finalBuffer));
    curl_multi_add_handle(this->multi_handle, this->curl);
    for (int i = 0; i < length * 20; i++)
        curl_multi_perform(this->multi_handle, &still_running);
    do
    {
        CURLMcode mc = curl_multi_perform(multi_handle, &still_running);
        if (!mc && still_running)
            mc = curl_multi_poll(multi_handle, NULL, 0, 1000, NULL);
        if (mc)
        {
            fprintf(stderr, "curl_multi_poll() failed, code %d.\n", (int)mc);
            break;
        }
    } while (still_running);
    return true;
}
