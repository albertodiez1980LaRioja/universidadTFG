import { Component, OnInit } from '@angular/core';
import { OutputsService } from '../places/outputs/outputs.service';
import { IPlace } from '../places/places-interfaces';
import { PlacesService } from '../places/places.service';
import { IUser, RoleText } from '../users/users-interfaces';
import { UsersService } from '../users/users.service';
import { IAction, IOutputBase } from './actions-interfaces';
import { ActionsService } from './actions.service';
import { actionsConfig } from './actions.config';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  rangeInit = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  rangeEnd = new FormGroup({
    start: new FormControl(undefined),
    end: new FormControl(undefined),
  });
  usersDate: IUser[] = [];
  placesDate: IPlace[] = [];
  outputBase: IOutputBase[] = [];
  outputs: IAction[] = [];
  outputsView: IAction[] = [];
  actionsConfig = actionsConfig;
  roleText = RoleText;
  selectedPlace = 'TODOS';
  selectedUser = 'TODOS';
  selectedOutput = 'TODOS';


  constructor(public usersService: UsersService,
    public placesService: PlacesService,
    public outputsService: OutputsService,
    public actionService: ActionsService) { }

  ngOnInit(): void {
    let init = new Date();
    let end = new Date(init);
    init.setMonth(init.getMonth() - 12);
    this.rangeInit.controls.start.setValue(init);
    this.rangeInit.controls.end.setValue(end);
    // leer datos en cascada
    this.fetchUsers();
  }

  tableEvent($event: any) {

  }

  fetchUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.usersDate = response.data;
        this.usersDate.forEach(user => {
          if (user.roles < this.roleText.length)
            user.roleText = this.roleText[user.roles];
          else
            user.roleText = 'Desconocido';
        });
        this.fetchPlaces();
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }

  fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        this.placesDate = response.data;
        for (let i = 0; i < response.data.length; i++) {
          this.placesDate[i].personsNames = [];
          for (let i2 = 0; i2 < response.data[i].persons.length; i2++) {
            this.placesDate[i].personsNames.push(response.data[i].persons[i2].name);
          }
        }
        this.fetchOutputs();
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }


  lastEndDate = new Date();
  lastInitDate = new Date();

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


  changeFilter() {
    this.outputsView = [...this.outputs];
    if (this.rangeInit.controls.start.value && this.rangeInit.controls.end.value) {
      if (this.lastInitDate != this.rangeInit.controls.start.value ||
        this.lastEndDate != this.rangeInit.controls.end.value) {
        this.lastInitDate = this.rangeInit.controls.start.value;
        this.lastEndDate = this.rangeInit.controls.end.value;
        const begin = new Date(this.rangeInit.controls.start.value);
        this.setDateInit(begin);
        const end = new Date(this.rangeInit.controls.end.value);
        this.setDateEnd(end);
        this.outputsView.forEach((element) => element.date = new Date(element.date));
        this.outputsView = this.outputsView.filter(alarm => alarm.date.getTime() >= begin.getTime()
          && alarm.date.getTime() <= end.getTime());
      }
    }

    if (this.selectedOutput != 'TODOS') {
      this.outputsView = this.outputsView.filter((element) => element.outputId.toString() == this.selectedOutput);
    }
    if (this.selectedPlace != 'TODOS') {
      this.outputsView = this.outputsView.filter((element) => element.placeId.toString() == this.selectedPlace);
    }
    if (this.selectedUser != 'TODOS') {
      this.outputsView = this.outputsView.filter((element) => element.personId.toString() == this.selectedUser);
    }
  }

  clear() {
    let init = new Date();
    let end = new Date(init);
    init.setMonth(init.getMonth() - 12);
    this.rangeInit.controls.start.setValue(init);
    this.rangeInit.controls.end.setValue(end);
    this.selectedOutput = 'TODOS';
    this.selectedPlace = 'TODOS';
    this.selectedUser = 'TODOS';
    this.fetchOutputs();
  }

  fetchOutputs() {
    this.outputsService.getOutputs().subscribe({
      next: (result: any) => {
        this.outputBase = result.data;
        this.actionService.getMeasurementsRange(new Date()).subscribe({
          next: (result: any) => {
            this.outputs = result.data;
            for (let i = 0; i < this.outputs.length; i++) {
              let user = this.usersDate.find((element) => element.id == this.outputs[i].personId);
              this.outputs[i].user = user;
              let place = this.placesDate.find((element) => element.id == this.outputs[i].placeId);
              this.outputs[i].place = place;
              let output = this.outputBase.find((element) => element.id == this.outputs[i].outputId);
              this.outputs[i].output = output;
              this.outputs[i].out = output?.name;
              this.outputs[i].address = place?.address;
              this.outputs[i].placeName = place?.identifier;
              this.outputs[i].userNick = user?.user_name;
            }
            this.outputsView = this.outputs;
          },
          error: (err: any) => {
            console.log('Ha ocurrido un error: ', err);
          }
        });
      },
      error: (err: any) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }

  fetchActions() {

  }
}
