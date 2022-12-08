#include "GetLastAction.hpp"

bool GetLastAction::actions[NUM_ACTIONS] = {false, false, false, false};
int GetLastAction::action = 0;
bool GetLastAction::success = false;

int GetLastAction::getNumActions()
{
    return NUM_ACTIONS;
}
bool GetLastAction::getAction(int i)
{
    if (i < NUM_ACTIONS)
        return actions[i];
    return false;
}
bool GetLastAction::call()
{
    this->curl = curl_easy_init();
    GetLastAction::success = false;
    if (!this->curl)
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

size_t GetLastAction::handle_impl(void *buffer, size_t size, size_t nmemb)
{
    struct json_object *parsed_json;
    struct json_object *data;
    struct json_object *action;

    GetLastAction::action = 0;
    parsed_json = json_tokener_parse((char *)buffer);
    if (!json_object_object_get_ex(parsed_json, "data", &data))
        return size * nmemb;

    int numActions = json_object_array_length(data);
    int pow = 1;
    for (int i = 0; i < numActions; i++)
    {
        struct json_object *date;
        struct json_object *output;
        struct json_object *value;
        action = json_object_array_get_idx(data, i);
        if (action != NULL)
        {
            if (json_object_object_get_ex(action, "date", &date) &&
                json_object_object_get_ex(action, "outputId", &output) &&
                json_object_object_get_ex(action, "value", &value))
            {

                if (strcmp("true", json_object_get_string(value)) == 0)
                {
                    this->actions[i] = true;
                    GetLastAction::action = GetLastAction::action + pow;
                }
                else
                    this->actions[i] = false;
            }
        }
        pow = pow * 2;
    }
    if (numActions > 0)
        GetLastAction::success = true;
    return size * nmemb;
}
