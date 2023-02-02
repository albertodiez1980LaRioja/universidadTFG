import { Component, OnInit } from '@angular/core';
import { OutputsService } from '../places/outputs/outputs.service';
import { IOutput, IPlace } from '../places/places-interfaces';
import { PlacesService } from '../places/places.service';
import { IUser, RoleText } from '../users/users-interfaces';
import { UsersService } from '../users/users.service';
import { IAction, IOutputBase } from './actions-interfaces';
import { ActionsService } from './actions.service';
import { actionsConfig } from './actions.config';
import { TableComponent } from 'src/app/shared/component/table/table.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
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

  changeFilter() {
    console.log('Haciendo filtros con:', this.selectedOutput, this.selectedPlace, this.selectedUser);
    this.outputsView = [...this.outputs];
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

  fetchOutputs() {
    this.outputsService.getOutputs().subscribe({
      next: (result: any) => {
        this.outputBase = result.data;
        console.log('output base:', this.outputBase);
        console.log('los usuarios:', this.usersDate);
        console.log('los lugares:', this.placesDate);
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
            console.log('outputs', this.outputs);
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
