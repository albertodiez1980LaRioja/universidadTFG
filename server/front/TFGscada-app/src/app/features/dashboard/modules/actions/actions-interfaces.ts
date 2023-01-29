import { IUser } from '../../../dashboard/modules/users/users-interfaces';
import { IPlace } from '../../../dashboard/modules/places/places-interfaces';
import { IOutput } from '../../../dashboard/modules/places/places-interfaces';

export interface IAction {
    date: Date;
    placeId: number;
    personId: number;
    outputId: number;
    user: IUser | undefined;
    place: IPlace | undefined;
    output: IOutputBase | undefined;

    address: string | undefined;
    out: string | undefined;
    placeName: string | undefined;
    userNick: string | undefined;

    sended: boolean;
    value: boolean;
}

export interface IOutputBase {
    id: number;
    name: string;
}