export var multi: {
    name: string, series: {
        name: Date, value: number
            , max: number | undefined, min: number | undefined
    }[]
}[] = [
        {
            name: "Personas",
            series: []
        },
        {
            "name": "Sonido",
            "series": []
        },
        {
            "name": "Aceite",
            "series": []
        },
        {
            "name": "Gas",
            "series": []
        },
        {
            "name": "Lluvia",
            "series": []
        },
    ];

export var DHT11: {
    name: string, series: {
        name: Date, value: number
            , max: number | undefined, min: number | undefined
    }[]
}[] = [
        {
            name: "Temperatura",
            series: []
        },
        {
            name: "Humedad",
            series: []
        },
    ];

export var binarios: {
    name: string, series: {
        name: Date, value: number
            , max: number | undefined, min: number | undefined
    }[]
}[] = [
        {
            name: "Vibración",
            series: []
        },
        {
            name: "Obstáculos",
            series: []
        },
        {
            name: "Luz",
            series: []
        },
        {
            name: "Fuego",
            series: []
        },

    ];

