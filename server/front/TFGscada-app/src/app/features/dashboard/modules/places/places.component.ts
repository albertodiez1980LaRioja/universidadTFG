import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PlacesService } from './places.service';
import { placesConfig, dialogConfig } from './places.config';
import { IMeasurement, IOP, IPlace } from './places-interfaces';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/component/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users/users.service';


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
    public matTab: MatTabsModule, private dialog: MatDialog,
    public usersService: UsersService) {
  }

  selected = new FormControl(0);
  tabs = ['Datos', 'Mapa', 'Mediciones de lugar', 'Salidas'];

  tabSelected = 1;
  placeSelected: IPlace | undefined;

  addTab(selectAfterAdding: boolean) {
    this.selected.setValue(this.tabs.length - 1);
  }

  ngOnInit(): void {
    this.fetchPlaces();
    this.selected.setValue(1);
    this.tabSelected = 1;
  }



  async fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        this.placesDate = response.data;
        for (let i = 0; i < response.data.length; i++) {
          console.log('lugar', response.data[i]);
          this.placesDate[i].personsNames = [];
          for (let i2 = 0; i2 < response.data[i].persons.length; i2++) {
            this.placesDate[i].personsNames.push(response.data[i].persons[i2].name);
          }
        }
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }

  disableOutput = true;

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
        this.disableOutput = false;
        this.placeSelected = $event.row;
        this.tabSelected = 4;
        break;

    }
  }
  clickSearch($event: any) { }

  clearFilter($event: any) { }

  addPlace() {
    let column = this.dialogConfig.columns.filter((element) => element.prop == 'persons');
    if (column != undefined && column.length > 0) {
      column[0].chipsSelecteds = [];
      this.usersService.getUsers().subscribe({
        next: (response: any) => {
          console.log('respuesta: ', response);
          column[0].chipsToSelect = [];
          response.data.forEach((user: any) => {
            if (user.name) {
              column[0].chipsToSelect?.push(user.name);
            }
          });
          this.dialogConfig.action = 'insert';
          const dialogRef = this.dialog.open(DialogComponent, {
            data: this.dialogConfig,
          });
          dialogRef.afterClosed().subscribe(result => {

            let personsIds: number[] = [];
            if (column[0].chipsSelecteds)
              for (let i = 0; i < column[0].chipsSelecteds.length; i++) {
                const id = response.data.filter((element: any) => column[0].chipsSelecteds && element.name == column[0].chipsSelecteds[i]);
                if (id != undefined && id.length > 0) {
                  personsIds.push(id[0].id);
                }
              }
            console.log('The dialog was closed', column[0].chipsSelecteds, personsIds);
            result.idPersons = personsIds;
            if (result) {
              delete result.id;
              console.log(result);
              this.placesService.save(result).subscribe({
                next: async (result: any) => {
                  let ops: IOP[] = [];
                  console.log('guardado', result);
                  // hay que guardar cada tabla intermedia
                  this.fetchPlaces();
                },
                error: (err: any) => {
                  console.log(err);
                }
              });;
            }
          });
        },
        error: (err) => {
          console.log('Ha ocurrido un error: ', err);
        }
      });
    }

  }

}
