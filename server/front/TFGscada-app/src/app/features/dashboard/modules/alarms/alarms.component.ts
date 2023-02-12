import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ISensor } from 'src/app/shared/interfaces/sersors.interfaces';
import { SensorsService } from 'src/app/shared/services/sensors.service';
import { IPlace } from '../places/places-interfaces';
import { PlacesService } from '../places/places.service';
import { IUser } from '../users/users-interfaces';
import { UsersService } from '../users/users.service';
import { IAlarm } from './alarms-interfaces';
import { AlarmsService } from './alarms.service';
import { alarmsConfig } from './alarms.config';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit {
  alarms: IAlarm[] = [];
  isLoadingTable = true;
  alarmsConfig = alarmsConfig;

  constructor(private alarmsService: AlarmsService,
    private sensorsService: SensorsService,
    private usersService: UsersService,
    private placesService: PlacesService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const init = new Date();
    let end = new Date(init);
    end.setMonth(end.getMonth() - 1);
    this.isLoadingTable = true;
    forkJoin([this.alarmsService.get(init, end, 1000),
    this.sensorsService.get(),
    this.usersService.getUsers(),
    this.placesService.get()]).subscribe({
      next: (response: any) => {
        this.alarms = response[0].data;
        const sensors: ISensor[] = response[1].data;
        const users: IUser[] = response[2].data;
        const places: IPlace[] = response[3].data;
        console.log('multiple:', response);
        this.alarms.forEach((alarm) => {
          alarm.sensor = sensors.find((sensor) => sensor.id == alarm.sensorId);
          alarm.operator = users.find((person) => person.id == alarm.operatorId); // may be undefined
          alarm.place = places.find((place) => place.id == alarm.placeId);
        });
        console.log('Alarmas: ', this.alarms);
        this.isLoadingTable = false;
      },
      error: (err) => {
        console.log('Error on multiple:', err);
      }
    });
  }

  tableEvent($event: any) { }

}
