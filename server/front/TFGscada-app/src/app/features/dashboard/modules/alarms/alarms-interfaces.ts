
import { IUser } from '../../../dashboard/modules/users/users-interfaces';
import { ISensor } from 'src/app/shared/interfaces/sersors.interfaces';
import { IPlace } from '../places/places-interfaces';

export interface IAlarm {
    id: number;
    date_time: Date;
    sensorId: number;
    operatorId: number;
    date_finish: Date;
    placeId: number;
    sensorDescription: string | undefined;
    operatorDescription: string | undefined;
    placeDescription: string | undefined;
    sensor: ISensor | undefined;
    operator: IUser | undefined;
    place: IPlace | undefined;
}

