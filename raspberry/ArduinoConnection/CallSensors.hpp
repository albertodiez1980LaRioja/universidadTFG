#ifndef CALLSENSORS_H
#define CALLSENSORS_H

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

#include "ArduinoCall.hpp"

class CallSensors : public ArduinoCall
{
public:
    CallSensors(ArduinoConnection *Connection) : ArduinoCall(Connection)
    {
    }
    bool callToArduino();
};

#endif