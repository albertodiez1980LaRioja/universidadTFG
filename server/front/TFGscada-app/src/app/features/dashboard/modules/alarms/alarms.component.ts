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
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})



export class AlarmsComponent implements OnInit {
  rangeInit = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  rangeEnd = new FormGroup({
    start: new FormControl(undefined),
    end: new FormControl(undefined),
  });



  alarms: IAlarm[] = [];
  alarmsView: IAlarm[] = [];
  isLoadingTable = true;
  alarmsConfig = alarmsConfig;
  sensors: ISensor[] = [];
  users: IUser[] = [];
  places: IPlace[] = [];
  selectedUser: any;
  selectedPlace: any;
  selectedSensor: any;
  subscription$: any = undefined;
  isLoading = true;

  constructor(private alarmsService: AlarmsService,
    private sensorsService: SensorsService,
    private usersService: UsersService,
    private placesService: PlacesService,
    private datePipe: DatePipe) {
    this.subscription$ = undefined;
  }

  ngOnInit(): void {
    this.isLoadingTable = true;
    this.isLoading = false;
    this.clear();
    this.fetchData();
    this.changeFilter();
    this.datePipe.transform(new Date(), 'dd-MM-yy');
  }

  fetchData() {
    let init = new Date();
    let end = new Date(init);
    init.setMonth(init.getMonth() - 12);

    if (this.rangeInit.controls.start.value && this.rangeInit.controls.end.value) {
      init = new Date(this.rangeInit.controls.start.value);
      this.setDateInit(init);
      end = new Date(this.rangeInit.controls.end.value);
      this.setDateEnd(end);
    }
    if (this.isLoading) {
      console.log('Todavía leyendo');
      return;
    }
    this.isLoading = true;
    forkJoin([this.alarmsService.get(end, init, 1000),
    this.sensorsService.get(),
    this.usersService.getUsers(),
    this.placesService.get()]).subscribe({
      next: (response: any) => {
        this.alarms = response[0].data;
        this.sensors = response[1].data;
        this.users = response[2].data;
        this.places = response[3].data;
        this.sensors.sort(function (a, b) { return a.id - b.id; });
        this.users.sort(function (a, b) { return a.id - b.id; });
        this.places.sort(function (a, b) { return a.id - b.id; });
        this.alarms.forEach((alarm) => {

          alarm.date_time = new Date(alarm.date_time);
          alarm.sensor = this.sensors.find((sensor) => sensor.id == alarm.sensorId);
          if (alarm.sensor)
            alarm.sensorDescription = alarm.sensor.description;
          alarm.operator = this.users.find((person) => person.id == alarm.operatorId); // may be undefined
          if (alarm.operator)
            alarm.operatorDescription = alarm.operator.name;
          alarm.place = this.places.find((place) => place.id == alarm.placeId);
          if (alarm.place)
            alarm.placeDescription = alarm.place.identifier;
          if (alarm.date_finish) {
            alarm.date_finish = new Date(alarm.date_finish);
            if (alarm.operator)
              alarm.color = '#90EE90'; // green
            else
              alarm.color = '#FFFAA0'; // yellow
          }
          else {
            alarm.date_finish = undefined;
            if (alarm.operator)
              alarm.color = '#FFFAA0'; // yellow
            else
              alarm.color = '#FAA0A0'; // red
          }
        });
        if (this.isLoadingTable)
          this.alarmsView = [...this.alarms];
        if (this.subscription$ == undefined)
          this.subscription$ = setInterval(this.changeFilter.bind(this), 5000);
        this.isLoadingTable = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error on multiple:', err);
        //setTimeout(this.fetchData.bind(this), 5000);
      }
    });
  }

  tableEvent($event: any) {
    if ($event.action == 'Acusar') {
      this.alarmsService.update($event.row.id, { operatorId: 1 }).subscribe({
        next: (result) => {
          this.fetchData();
        },
        error: (err) => {
          console.log('Error on update alarm', err);
        }
      });
    }
  }

  setDateInit(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  }

  setDateEnd(date: Date) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(0);
  }

  lastEndDate = new Date();
  lastInitDate = new Date();

  changeFilter() {
    this.alarmsView = [...this.alarms];
    if (this.rangeInit.controls.start.value && this.rangeInit.controls.end.value) {
      if (this.lastInitDate != this.rangeInit.controls.start.value ||
        this.lastEndDate != this.rangeInit.controls.end.value) {
        this.lastInitDate = this.rangeInit.controls.start.value;
        this.lastEndDate = this.rangeInit.controls.end.value;
        const begin = new Date(this.rangeInit.controls.start.value);
        this.setDateInit(begin);
        const end = new Date(this.rangeInit.controls.end.value);
        this.setDateEnd(end);
        this.alarmsView.forEach((element) => element.date_time = new Date(element.date_time));
        this.alarmsView = this.alarmsView.filter(alarm => alarm.date_time >= begin
          && alarm.date_time <= end);
      }
    }
    if (this.rangeEnd.controls.start.value && this.rangeEnd.controls.end.value) {
      const begin = new Date(this.rangeEnd.controls.start.value);
      const end = new Date(this.rangeEnd.controls.end.value);
      this.setDateInit(begin);
      this.setDateEnd(end);
      this.alarmsView = this.alarmsView.filter(alarm => alarm.date_time >= begin
        && alarm.date_time <= end);
    }
    if (this.selectedPlace && this.selectedPlace != '' && this.selectedPlace != 'TODOS') {
      this.alarmsView = this.alarmsView.filter((alarm) => alarm.place?.id == this.selectedPlace);
    }
    if (this.selectedUser && this.selectedUser != '' && this.selectedUser != 'TODOS') {
      this.alarmsView = this.alarmsView.filter((alarm) => alarm.operator?.id == this.selectedUser);
    }
    if (this.selectedSensor && this.selectedSensor != '' && this.selectedSensor != 'TODOS') {
      this.alarmsView = this.alarmsView.filter((alarm) => alarm.sensor?.id == this.selectedSensor);
    }
    this.fetchData();
  }

  clear() {
    this.isLoadingTable = true;
    let init = new Date();
    let end = new Date(init);
    init.setMonth(init.getMonth() - 12);
    this.rangeInit.controls.start.setValue(init);
    this.rangeInit.controls.end.setValue(end);
    this.rangeEnd.controls.start.setValue(undefined);
    this.rangeEnd.controls.end.setValue(undefined);
    this.selectedSensor = 'TODOS';
    this.selectedPlace = 'TODOS';
    this.selectedUser = 'TODOS';
    this.changeFilter();
    this.fetchData();
  }

}
