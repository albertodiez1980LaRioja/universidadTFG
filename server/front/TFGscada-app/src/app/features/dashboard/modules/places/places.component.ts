import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PlacesService } from './places.service';
import { placesConfig, dialogConfig } from './places.config';
import { IMeasurement, IPlace } from './places-interfaces';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  placesConfig = placesConfig;
  dialogConfig = dialogConfig;
  placesDate: IPlace[] = [];
  lastMeasurements: IMeasurement[] = [];

  constructor(public placesService: PlacesService,
    matTab: MatTabsModule,) {
  }

  selected = new FormControl(0);
  tabs = ['Datos', 'Mapa', 'Mediciones de lugar', 'Salidas'];

  addTab(selectAfterAdding: boolean) {
    //this.tabs.push('New');

    //if (selectAfterAdding) {
    this.selected.setValue(this.tabs.length - 1);
    //}
  }

  ngOnInit(): void {
    this.fetchPlaces();
    this.selected.setValue(1);
  }



  async fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        console.log('respuesta: ', response);
        this.placesDate = response.data;
        console.log('lugares', this.placesDate);
        /*this.usersDate.forEach(user => {
          if (user.roles < this.roleText.length)
            user.roleText = this.roleText[user.roles];
          else
            user.roleText = 'Desconocido';
        });*/
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });

  }


  async tableEvent($event: any) {
    console.log('Evento de la tabla: ', $event);
    switch ($event.action) {
      case 'Update':
        /*this.dialogConfig.action = 'update';
        this.dialogConfig.editable = true;
        for (let i = 0; i < this.dialogConfig.columns.length; i++) {
          this.dialogConfig.columns[i].value = $event.row[this.dialogConfig.columns[i].prop];
        }
        const dialogRef = this.dialog.open(DialogComponent, {
          data: this.dialogConfig,
        });

        dialogRef.afterClosed().subscribe(async result => {
          if (result != '') {
            // save the row
            let user = result;
            const keys = Object.keys(result);
            if (user['pass'] == undefined || user['pass'] == '')
              delete user['pass'];
            for (let i = 0; i < keys.length; i++) {
              if (keys[i] == 'roleText') {
                user['roles'] = this.roleText.indexOf(result[keys[i]]);
              }
            }
            await this.usersService.updateUser(user).toPromise().then((result: any) => {
              console.log(result);
            });
            this.fetchUsers();
          }
        });*/
        break;
      case 'Delete':
        /*this.usersService.deleteUser($event.row.id).subscribe({
          next: (result: any) => {
            console.log(result);
            this.fetchUsers();
          },
          error: (err: any) => {
            console.log(err);
          }
        });*/
        break;
      case 'View':
        /*this.dialogConfig.action = 'view';
        this.dialogConfig.editable = false;
        for (let i = 0; i < this.dialogConfig.columns.length; i++) {
          this.dialogConfig.columns[i].value = $event.row[this.dialogConfig.columns[i].prop];
        }
        const dialogRef2 = this.dialog.open(DialogComponent, {
          data: this.dialogConfig,
        });*/
        break;

    }
  }


}
