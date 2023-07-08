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
    bool callToArduino(int seconds);

    int getBinaryValues() { return this->binary_values; };
    int getHasPersons() { return this->has_persons; };
    int getHasSound() { return this->has_sound; };
    int getHasGas() { return this->has_gas; };
    int getHasOil() { return this->has_oil; };
    int getHasRain() { return this->has_rain; };
    int getTemperature() { return this->temperature; };
    int getHumidity() { return this->humidity; };
};

#endif