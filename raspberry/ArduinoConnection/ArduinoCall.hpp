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