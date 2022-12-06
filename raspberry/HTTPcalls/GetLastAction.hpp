#ifndef GETLASTACTION_H
#define GETLASTACTION_H

#include <stdio.h>
#include <curl/curl.h>
#include <json-c/json.h>
#include <string.h>
#include "HTTPcall.hpp"

class GetLastAction : HTTPcall
{
#define NUM_ACTIONS 4
    static bool actions[NUM_ACTIONS];
    static int action;
    static size_t handle(char *data, size_t size, size_t nmemb, void *p)
    {
        return static_cast<GetLastAction *>(p)->handle_impl(data, size, nmemb);
    }
    size_t handle_impl(void *buffer, size_t size, size_t nmemb);

public:
    GetLastAction(char *identifier, char *pass, char *url) : HTTPcall(identifier, pass, url) {}
    int getNumActions();
    bool getAction(int i);
    int getAllAction()
    {
        return GetLastAction::action;
    }
    bool call();
};

#endif