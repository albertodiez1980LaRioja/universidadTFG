#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>

static size_t
loadToken(void *buffer, size_t size, size_t nmemb, void *userp);

class HTTPcall
{
    static time_t seconds;
    static char *identifier;
    static char *pass;

    static CURL *curlToken;
    char *loadTokenPlace(char *identifier, char *pass);

protected:
    CURL *curl;
    static CURLM *multi_handle;
    char *url;

public:
    static char *token;
    HTTPcall(char *identifier, char *pass, char *url)
    {
        this->curl = curl_easy_init();
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
        }
    }
    static bool allCallsCompleted()
    {
        int still_running = 0;
        if (multi_handle != NULL)
        {
            // curl_multi_perform(multi_handle, &still_running);
            curl_multi_perform(multi_handle, &still_running);
            // curl_multi_info_read(this->multi_handle, &still_running);
        }
        else
            printf("No inicializado\n");
        if (still_running)
            return false;
        return true;
    }
    char *getToken()
    {
        if ((time(NULL) - this->seconds) > 3600)
        {
            this->seconds = time(NULL);
            this->token = this->loadTokenPlace(identifier, pass);
        }
        return this->token;
    }
};

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

// inicialize static
char *HTTPcall::token = NULL;
CURLM *HTTPcall::multi_handle = NULL;
CURLM *HTTPcall::curlToken = NULL;
char *HTTPcall::identifier = NULL;
char *HTTPcall::pass = NULL;
time_t HTTPcall::seconds = 0;

class GetLastAction : HTTPcall
{
#define NUM_ACTIONS 4
    static bool actions[NUM_ACTIONS];
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<GetLastAction *>(p)->handle_impl(data, size, nmemb);
    }
    size_t handle_impl(void *buffer, size_t size, size_t nmemb);

public:
    GetLastAction(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url)
    {
        for (int i = 0; i < NUM_ACTIONS; i++)
            this->actions[i] = false;
        this->curl = curl_easy_init();
    }
    int getNumActions()
    {
        return NUM_ACTIONS;
    }
    bool getAction(int i)
    {
        if (i < NUM_ACTIONS)
            return actions[i];
        return false;
    }
    bool call()
    {
        if (!curl)
            return false;
        char aux[2000];
        char auxURL[2000];
        int still_running;
        struct curl_slist *headers = NULL;
        sprintf(auxURL, "%s%s", this->url, "/api/actions/place/place");
        curl_easy_setopt(this->curl, CURLOPT_URL, auxURL);
        curl_easy_setopt(this->curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(this->curl, CURLOPT_WRITEFUNCTION, &GetLastAction::handle);
        sprintf(aux, "x-access-token: %s", this->getToken());
        headers = curl_slist_append(headers, aux);
        curl_easy_setopt(this->curl, CURLOPT_HTTPHEADER, headers);
        curl_multi_add_handle(this->multi_handle, curl);
        curl_multi_perform(this->multi_handle, &still_running);
        return true;
    }
};
bool GetLastAction::actions[NUM_ACTIONS] = {false, false, false, false};
size_t GetLastAction::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *parsed_json;
    struct json_object *data;
    struct json_object *action;

    parsed_json = json_tokener_parse((char *)buffer);
    json_object_object_get_ex(parsed_json, "data", &data);
    int numActions = json_object_array_length(data);
    for (int i = 0; i < numActions; i++)
    {
        struct json_object *date;
        struct json_object *output;
        struct json_object *value;
        // hay hay que hacer comprobaciones por si falla algo
        action = json_object_array_get_idx(data, i);
        if (action != NULL)
        {
            if (json_object_object_get_ex(action, "date", &date) &&
                json_object_object_get_ex(action, "outputId", &output) &&
                json_object_object_get_ex(action, "value", &value))
            {
                if (strcmp("true", json_object_get_string(value)) == 0)
                    this->actions[i] = true;
                else
                    this->actions[i] = false;
                // printf("Fecha: %s output: %d value: %s %d\n", json_object_get_string(date),
                //        json_object_get_int(output), json_object_get_string(value), strcmp("true", json_object_get_string(value)));
            }
        }
        // queda meter esto en una estructura o en su clase, también mandar las mediciones
    }

    return size * nmemb;
}

class GetActualizationTime : HTTPcall
{
    static int actualizationTime;
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<GetActualizationTime *>(p)->handle_impl(data, size, nmemb);
    }
    size_t handle_impl(void *buffer, size_t size, size_t nmemb);

public:
    GetActualizationTime(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url)
    {
        GetActualizationTime::actualizationTime = 0;
    }
    int getActualizationTime()
    {
        return GetActualizationTime::actualizationTime;
    }
    bool call()
    {
        if (!curl)
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
};

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

class PostMeasurement : HTTPcall
{
    static bool success;
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<PostMeasurement *>(p)->handle_impl(data, size, nmemb);
    }
    static size_t handle_impl(void *buffer, size_t size, size_t nmemb);
    /*
    curl_slist_append(headers, "Accept: application/json");
    curl_slist_append(headers, "Content-Type: application/json");
    curl_slist_append(headers, "charset: utf-8");
    */
public:
    PostMeasurement(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url) {}
    bool call(char *dateString, int binary_values, int has_persons, int has_sound, int has_gas, int has_oil,
              int has_rain, int temperature, int humidity)
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
        // char buffer[2000] = "{ \"identifier\" : \"aaabaa\" , \"pass\" : \"abc\" }             ";
        //   sprintf(buffer, "{ \"identifier\" : \"%s\" , \"pass\" : \"%s\" }", "", "");
        // falla para un tamaño mayor de 800, en ese caso hay que hacer un equivalente de asíncrono
        // puede ser por el tamaño de los paquetes
        char buffer[1000] = "{ \"date_time\": \"2022-05-28T10:51:24Z\",\"binary_values\": 1000,\"has_persons\": 1000,\"has_sound\": 0,\"has_gas\": 0,\"has_oil\": 0,\"has_rain\": 0,\"temperature\": 0,\"humidity\": 0 } ";
        sprintf(buffer, "{ \"date_time\": \"%s\",\"binary_values\": %d,\"has_persons\": %d,\"has_sound\": %d,\"has_gas\": %d,\"has_oil\": %d,\"has_rain\": %d,\"temperature\": %d,\"humidity\": %d }",
                dateString, binary_values, has_persons, has_sound, has_gas, has_oil,
                has_rain, temperature, humidity);
        // char buffer[2000] = "{}";
        // printf("Buffer: %d\n", strlen(buffer));
        curl_easy_setopt(this->curl, CURLOPT_POSTFIELDS, buffer);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (long)strlen(buffer));
        // CURLcode res = curl_easy_perform(this->curl);
        //  curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
        curl_multi_add_handle(this->multi_handle, this->curl);
        curl_multi_perform(this->multi_handle, &still_running);
        // esto es necesario para un valor mayor de 800, pero entonces ya no sería asíncrono
        /*do
        {
            curl_multi_perform(this->multi_handle, &still_running);
            // still_running = 0;
            //  if (still_running)

            //    mc = curl_multi_poll(multi_handle, NULL, 0, 1000, NULL);
            // if (mc)
            //    break;
        } while (still_running);*/

        // curl_multi_poll(multi_handle, NULL, 0, 1000, NULL);
        return true;
    }
};

bool PostMeasurement::success = false;

size_t PostMeasurement::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *message;
    struct json_object *parsed_json;
    parsed_json = json_tokener_parse((char *)buffer);
    json_object_object_get_ex(parsed_json, "message", &message);
    // json_object_object_get_ex(place, "actualizationTime", &actualizationTime);
    printf("El mensaje es: %s\n", json_object_get_string(message));
    PostMeasurement::success = true;
    return size * nmemb;
}

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

int main(void)
{
    // HTTPcall httpcall(strdup("aaaaa"), strdup("abc"));
    GetLastAction getLastAction(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    GetActualizationTime getActualizationTime(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    PostMeasurement postMeasurement(strdup("aaaaa"), strdup("abc"), strdup("http://localhost:3000"));
    getLastAction.call();
    getActualizationTime.call();
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    // 2022-05-28T10:51:24Z
    char dateString[200];
    sprintf(dateString, "%d-%02d-%02dT%02d:%02d:%02dZ", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    // printf("now: %d-%02d-%02dT%02d:%02d:%02dZ\n", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    printf("now: %s\n", dateString);
    postMeasurement.call(dateString, 2, 2, 2, 2, 2, 2, 2, 2);
    while (!HTTPcall::allCallsCompleted())
    {
        // printf("Las llamadas sin terminar\n");
    }
    printf("Todas las llamadas terminadas\n");
    for (int i = 0; i < getLastAction.getNumActions(); i++)
    {
        if (getLastAction.getAction(i))
            printf("Accion: %d es true\n", i);
        else
            printf("Accion: %d es false\n", i);
    }
    printf("Velocidad de la actualización: %d\n", getActualizationTime.getActualizationTime());
    //  httpcall.allCallsCompleted();
    CURL *curl;
    // CURLcode res;
    CURLM *multi_handle;
    struct curl_slist *headers = NULL;
    char token[] = "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGFjZSI6eyJpZCI6MSwibGF0aXR1ZGUiOjk5OCwibG9uZ2l0dWRlIjo5OTksImFkZHJlc3MiOiJQZXF1ZcOxYSB2w61hIDExMiwgNCBCIiwiaWRlbnRpZmllciI6ImFhYWFhIiwicGFzcyI6IiQyYiQxMCRGcXlYNGlsSXNweEk4MlVmVm9uenQuMUdYemZjalRPLmF4enljZTFjNUNaRjBaSjFXRGVBZSIsImFjdHVhbGl6YXRpb25UaW1lIjoxMjB9LCJpYXQiOjE2Njk5NzE2MDksImV4cCI6MTY3MDE0NDQwOX0.uSfRDU14hwPBYNUK-R3b6l1VCQJg_mWdWTUqH5P95sY"; // your actual token
    int still_running = 0;
    curl = curl_easy_init();
    multi_handle = curl_multi_init();
    if (curl && multi_handle && false)
    {
        // curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/api/actions/place/place");
        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/api/places/authenticate");
        /* example.com is redirected, so we tell libcurl to follow redirection */
        // curl_easy_setopt(curl, CURLOPT_CONNECT_ONLY, 1L);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        // curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, loadToken);
        headers = curl_slist_append(headers, token);
        curl_slist_append(headers, "Accept: application/json");
        curl_slist_append(headers, "Content-Type: application/json");
        curl_slist_append(headers, "charset: utf-8");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{ \"identifier\" : \"aaaaa\" , \"pass\" : \"abc\" }");
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
        CURLMsg *msg = curl_multi_info_read(multi_handle, &still_running);
        if (still_running == 0)
        {
            printf("\nTodos terminados %d \n", msg->easy_handle == curl);
        }
        else
        {
            printf("\nTodavía corriendo");
        }
        curl_multi_cleanup(multi_handle);
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }
    return 0;
    // to compile
    // gcc -Wall -o pruebaCurl pruebaCurl.cpp -I/usr/include/postgresql -lpq -lcurl -ljson-c
}