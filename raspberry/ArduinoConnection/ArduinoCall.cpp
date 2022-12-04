#include "ArduinoCall.hpp"

int ArduinoCall::deserialize(char *buffer, int lenght)
{
    // need change
    int aux[120];
    sscanf(buffer, "%d %d %d %d %d %d %d %d %d %d %d %d", &aux[0], &aux[1], &aux[2], &aux[3], &aux[4],
           &aux[5], &aux[6], &aux[7], &aux[8], &aux[9], &aux[10], &aux[11]);
    if (aux[11] != (aux[0] + aux[1] + aux[2] + aux[3] + aux[4] + aux[5] + aux[6] + aux[7] + aux[8] + aux[9] + aux[10]))
    {
        printf("Fail: %s\n", buffer);
        return 0;
    }
    this->has_persons = aux[0];
    this->has_sound = aux[2];
    this->has_gas = aux[4];
    this->has_rain = aux[6];
    this->has_oil = aux[5];
    this->temperature = aux[10];
    this->humidity = aux[9];
    this->binary_values = aux[1] + aux[3] * 2 + aux[7] * 4 + aux[8] * 8;
    return 1;
}
