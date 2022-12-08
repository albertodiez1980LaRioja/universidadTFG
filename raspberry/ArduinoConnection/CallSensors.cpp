#include "CallSensors.hpp"

void delayCall(float millis)
{
    clock_t start_time = clock();
    while (clock() < start_time + ((CLOCKS_PER_SEC / 1000.) * millis))
    {
    }
}

bool CallSensors ::callToArduino(int seconds)
{
    int lenghtBufferIn = 500;
    char bufferIn[500];
    if (seconds > 2)
        sleep(1);
    else
        delayCall(700);
    char toSend[] = "0 1 1 0 0 2     \n\0";
    printf("Se manda: %s", toSend);
    if ((this->arduinoConnection->write_to_serial(toSend, sizeof(toSend))) == -1)
    {
        fprintf(stderr, "write() failed: %s\n", strerror(errno));
        return false;
    }
    if (seconds > 2)
        sleep(1);
    else
        delayCall(700);
    this->arduinoConnection->read_from_serial(bufferIn, 500);
    if (this->deserialize(bufferIn, lenghtBufferIn))
    {
        printf("Paquete recibido: %s\n", bufferIn);
        printf("Paquete con checksum correcto\n\n");
        printf("Byte binarios %u\n", this->getBinaryValues());
        if (this->getBinaryValues() & 1)
            printf("Hay vibración\n");
        else
            printf("No hay vibración\n");
        if (this->getBinaryValues() & 2)
            printf("No hay obtaculo\n");
        else
            printf("Hay obstaculo\n");
        if ((this->getBinaryValues() & 4))
            printf("No luz\n");
        else
            printf("Hay luz\n");
        if (this->getBinaryValues() & 8)
            printf("No hay fuego\n");
        else
            printf("Hay fuego\n");
        if (this->getHasPersons() > 350)
            printf("Personas detectadas\n");
        else
            printf("Personas NO detectadas\n");
        if (this->getHasSound() > 600)
            printf("Sonido detectado \n");
        else
            printf("Sonido NO detectado \n");
        if (this->getHasGas() > 350)
            printf("Gas detectado\n");
        else
            printf("Gas NO detectado\n");
        if (this->getHasOil() < 500)
            printf("Aceite detectado\n");
        else
            printf("Aceite NO detectado\n");
        if (this->getHasRain() < 500)
            printf("Lluvia detectado\n");
        else
            printf("Lluvia NO detectado\n");
        printf("Humedad: %u\n", this->getHumidity());
        printf("Temperatura: %u\n", this->getTemperature());
    }
    else
    {
        printf("Paquete con checksum incorrecto\n\n");
        return false;
    }
    return true;
}