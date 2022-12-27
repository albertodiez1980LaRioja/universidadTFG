// #include <iostream>
#include <stdio.h>

class Singleton
{
private:
    Singleton()
    {
        printf("Contruyendo el singleton\n");
        // std::cout << "Constructor Singleton" << std::endl;
    }

    // Singleton(const Singleton &) = delete;
    // Singleton &operator=(const Singleton &) = delete;
    // static Singleton *instance;
    // tatic Singleton *instance;

public:
    static Singleton *GetInstance()
    {
        static Singleton instance;
        return &instance;
    }

    unsigned long long GetAddress()
    {
        return reinterpret_cast<unsigned long long>(this);
    }

    ~Singleton()
    {
        printf("Destruyendo el singleton\n");
        // std::cout << "Destructor Singleton" << std::endl;
    }
};

// Singleton *Singleton::instance = NULL;

int main()
{
    printf("Empezando\n");
    Singleton *instance1 = Singleton::GetInstance();
    unsigned long long address1 = instance1->GetAddress();
    printf("address %lld\n", address1);

    Singleton *instance2 = Singleton::GetInstance();
    unsigned long long address2 = instance2->GetAddress();
    printf("address %lld\n", address2);
}