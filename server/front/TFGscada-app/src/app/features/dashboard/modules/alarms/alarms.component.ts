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
    forkJoin([this.alarmsService.get(init, end, 1000),
    this.sensorsService.get(),
    this.usersService.getUsers(),
    this.placesService.get()]).subscribe({
      next: (response: any) => {
        this.alarms = response[0].data;
        const sensors: ISensor[] = response[1].data;
        const users: IUser[] = response[2].data;
        const places: IPlace[] = response[3].data;
        this.alarms.forEach((alarm) => {
          alarm.sensor = sensors.find((sensor) => sensor.id == alarm.sensorId);
          if (alarm.sensor)
            alarm.sensorDescription = alarm.sensor.description;
          alarm.operator = users.find((person) => person.id == alarm.operatorId); // may be undefined
          if (alarm.operator)
            alarm.operatorDescription = alarm.operator.name;
          alarm.place = places.find((place) => place.id == alarm.placeId);
          if (alarm.place)
            alarm.placeDescription = alarm.place.identifier;
        });
        this.isLoadingTable = false;
        setTimeout(this.fetchData.bind(this), 5000);
      },
      error: (err) => {
        console.log('Error on multiple:', err);
        setTimeout(this.fetchData.bind(this), 5000);
      }
    });
  }

  tableEvent($event: any) {
    console.log('evento', $event);
    if ($event.action == 'Acusar') {
      console.log('Se ha pulsado en acusar');
      this.alarmsService.update($event.row.id, { operatorId: 1 }).subscribe({
        next: (result) => {
          console.log(result);
          this.fetchData();
        },
        error: (err) => {
          console.log('Error on update alarm', err);
        }
      });
    }
  }

}
