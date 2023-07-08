#ifndef ARDUINOCALL_H
#define ARDUINOCALL_H

#include "ArduinoConnection.hpp"

class ArduinoCall
{
protected:
    ArduinoConnection *arduinoConnection;
    int binary_values, has_persons, has_sound, has_gas, has_oil, has_rain, temperature, humidity;

public:
    ArduinoCall(ArduinoConnection *arduinoConnection)
    {
        this->arduinoConnection = arduinoConnection;
        this->binary_values = this->has_persons = this->has_sound = this->has_oil = 0;
        this->has_rain = this->temperature = this->humidity = 0;
    }
    int deserialize(char *buffer, int lenght);
};

#endif