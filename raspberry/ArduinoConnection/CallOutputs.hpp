#ifndef CALLOUTPUTS_H
#define CALLOUTPUTS_H

#include "ArduinoCall.hpp"
#include "ArduinoConnection.hpp"

class CallOutputs : public ArduinoCall
{
public:
    CallOutputs(ArduinoConnection *Connection) : ArduinoCall(Connection)
    {
    }
    bool callToArduino(int action);
};
#endif