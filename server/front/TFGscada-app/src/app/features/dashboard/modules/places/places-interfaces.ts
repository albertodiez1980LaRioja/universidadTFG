
import { IUser } from '../../../dashboard/modules/users/users-interfaces';

export interface IPlace {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
    identifier: string;
    actualizationTime: number;
    pass: string;
    persons: IUser[];
    personsNames: string[];
}

export interface IOP {
    personId: number;
    placeId: number;
    priority: number;
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

export interface IOutput {
    date: Date;
    placeId: number;
    personId: number;
    outputId: number;
    value: boolean;
    sended: boolean;
}