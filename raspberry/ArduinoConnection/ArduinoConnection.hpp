#ifndef ARDUINOCONNECTION_H
#define ARDUINOCONNECTION_H

#include <stdio.h>
#include <stdlib.h>
#include <libpq-fe.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <curl/curl.h>

// for the serial I/O
#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include <linux/serial.h>
#include <sys/ioctl.h>
#include <sys/stat.h>

class ArduinoConnection
{
    int open_serial_port(char *name);
    int fd;
    bool iniciated;
    static char *name;

public:
    int read_from_serial(char *buf, int lon);
    int write_to_serial(void *buf, int lon)
    {
        return write(this->fd, buf, lon);
    }
    // ArduinoConnection(char *name);
    ArduinoConnection()
    {
        this->iniciated = false;
        this->fd = this->open_serial_port(ArduinoConnection::name);
    }
    bool getIniciated()
    {
        return this->iniciated;
    }
    static ArduinoConnection *GetInstance()
    {
        static ArduinoConnection instance;
        return &instance;
    }
    static void setName(char *nameIn)
    {
        ArduinoConnection::name = nameIn;
    }
};

#endif