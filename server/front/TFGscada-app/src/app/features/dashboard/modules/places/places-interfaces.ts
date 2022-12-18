export interface IPlace {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
}

export interface IMeasurement {
    id: number;
    date_time: Date;
    binary_values: number;
    has_persons: number;
    has_sound: string;
    has_gas: string;
    has_oil: number;
    has_rain: number;
    temperature: number;
    humidity: number;
    placeId: number;
    vibration: string;
    obstacle: string;
    light: string;
    fire: string;

}

