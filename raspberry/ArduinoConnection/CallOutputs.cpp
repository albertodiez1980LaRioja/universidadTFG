#include "CallOutputs.hpp"

bool CallOutputs ::callToArduino(int action)
{
    int lenghtBufferIn = 500;
    char bufferIn[500];
    sleep(1);
    char activate = 1;
    char output1 = 0;
    char output2 = 0;
    char output3 = 0;
    char output4 = 0;
    char toSend[] = "1 1 1 0 0 0     \n\0";
    if (action != -1)
    {
        if (action & 0x01)
            output1 = 1;
        if (action & 0x02)
            output2 = 1;
        if (action & 0x04)
            output3 = 1;
        if (action & 0x08)
            output4 = 1;
    }
    toSend[0] = activate + '0';
    toSend[2] = output1 + '0';
    toSend[4] = output2 + '0';
    toSend[6] = output3 + '0';
    toSend[8] = output4 + '0';
    char checksum = activate + output1 + output2 + output3 + output4;
    toSend[10] = checksum + '0';
    printf("Se manda: %s", toSend);
    if ((this->arduinoConnection->write_to_serial(toSend, sizeof(toSend))) == -1)
    {
        fprintf(stderr, "write() failed: %s\n", strerror(errno));
        exit(EXIT_FAILURE);
    }
    sleep(1);
    this->arduinoConnection->read_from_serial(bufferIn, 500);
    if (this->deserialize(bufferIn, lenghtBufferIn))
    {
        printf("Action updated:  %s\n", bufferIn);
        return 1;
    }
    printf("Fail to send action: %s\n", bufferIn);
    return 0;
};