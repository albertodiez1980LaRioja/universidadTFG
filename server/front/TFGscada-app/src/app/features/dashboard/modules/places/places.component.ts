import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PlacesService } from './places.service';
import { placesConfig, dialogConfig } from './places.config';
import { IPlace } from './places-interfaces';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/component/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users-interfaces';
import { TableComponent } from 'src/app/shared/component/table/table.component'
import { AuthService } from 'src/app/guards/auth.service';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  placesConfig = placesConfig;
  dialogConfig = dialogConfig;
  placesDate: IPlace[] = [];
  disableOutput = false;
  selected = new FormControl(0);
  tabs = ['places.data', 'places.measurementsHistory',
    'places.measurementsPlace', 'places.outputs', 'places.map'];
  tabSelected = 1;
  placeSelected: IPlace | undefined;

  constructor(public placesService: PlacesService,
    public matTab: MatTabsModule, private dialog: MatDialog,
    public usersService: UsersService,
    public auth: AuthService,) {
  }

  addTab(selectAfterAdding: boolean) {
    this.selected.setValue(this.tabs.length - 1);
  }

  ngOnInit(): void {
    this.fetchPlaces();
    this.fetchUsers();
    this.selected.setValue(1);
    this.tabSelected = 0;
  }

  async fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        this.placesDate = response.data;
        for (let i = 0; i < response.data.length; i++) {
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

  updatePlace($event: any) {
    this.dialogConfig.action = 'update';
    this.dialogConfig.editable = true;
    for (let i = 0; i < this.dialogConfig.columns.length; i++) {
      this.dialogConfig.columns[i].value = $event.row[this.dialogConfig.columns[i].prop];
    }
    let column = this.dialogConfig.columns.filter((element) => element.prop == 'persons');
    if (column && column.length > 0) {
      column[0].chipsToSelect = [];
      column[0].chipsSelecteds = [];
      for (let i = 0; i < $event.row['persons'].length; i++) {
        column[0].chipsSelecteds.push($event.row['persons'][i].name);
      }
      for (let i = 0; i < this.users.length; i++)
        column[0].chipsToSelect?.push(this.users[i].name);
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.dialogConfig,
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result != '') {
        let user = result;
        const keys = Object.keys(result);
        if (user['pass'] == undefined || user['pass'] == '')
          delete user['pass'];
        let personsIds: number[] = [];
        user.persons = [];
        if (column[0].chipsSelecteds)
          for (let i = 0; i < column[0].chipsSelecteds.length; i++) {
            const id = this.users.filter((element: any) => column[0].chipsSelecteds && element.name == column[0].chipsSelecteds[i]);
            if (id != undefined && id.length > 0) {
              personsIds.push(id[0].id);
              user.persons.push(id[0]);
            }
          }
        user.idPersons = personsIds;
        this.placesService.update((user)).subscribe({
          next: (response: any) => {
            this.fetchPlaces();
          },
          error: (err: any) => {
            console.log('Error: ', err);
          }
        });
      }
    });
  }

  async tableEvent($event: any) {
    switch ($event.action) {
      case 'Update':
        this.updatePlace($event);
        break;
      case 'Delete':
        this.placesService.delete($event.row.id).subscribe({
          next: (result: any) => {
            this.fetchPlaces();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
        break;
      case 'View':
        this.placeSelected = $event.row;
        this.tabSelected = 1;
        break;
    }
  }

  placeSelectedByMap($event: any) {
    this.placeSelected = $event;
    this.tabSelected = 1;
  }

  read_prop(obj: any, id: any) {
    if (id != undefined)
      return obj[id];
    return undefined;
  }

  @ViewChild("tablePlaces") tablePlaces: ElementRef | undefined;

  clickSearch($event: any) {
    this.dialogConfig.action = 'search';
    this.dialogConfig.editable = true;
    let column = this.dialogConfig.columns.filter((element) => element.prop == 'persons');
    if (column.length > 0) {
      column[0].chipsSelecteds = [];
      column[0].chipsToSelect = [];
      for (let i = 0; i < this.users.length; i++)
        column[0].chipsToSelect?.push(this.users[i].name);
    }
    for (let i = 0; i < this.dialogConfig.columns.length; i++) {
      this.dialogConfig.columns[i].value = '';
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
        if (this.tablePlaces != undefined) {
          let table = this.tablePlaces as unknown as TableComponent;
          table.dataSource.filterPredicate = (data: any, filter: string) => {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              let value = this.read_prop(result, keys[i]);
              if (value != undefined && value != '' && keys[i] != 'id' && !(keys[i] == 'roles' && value == -1)) {
                if (!this.read_prop(data, keys[i]).toString().toLowerCase().includes(value.toString().toLowerCase()))
                  return false;
              }
            }
            // filter by persons
            let column = this.dialogConfig.columns.filter((element) => element.prop == 'persons');
            if (column.length > 0 && column[0].chipsSelecteds && column[0].chipsSelecteds.length > 0) {
              let listNames: string[] = []
              for (let i = 0; i < data.persons.length; i++) {
                listNames.push(data.persons[i].name);
              }
              let contain = false;
              for (let i2 = 0; i2 < listNames.length && !contain; i2++) {
                if (column[0].chipsSelecteds.includes(listNames[i2]))
                  contain = true;
              }
              if (!contain)
                return false;
            }
            if (data.dni == user.dni)
              return true;
            return true;
          };
          this.applyFilter();
        }
      }
    });
  }

  applyFilter() {
    if (this.tablePlaces != undefined) {
      let table = this.tablePlaces as unknown as TableComponent;
      table.dataSource.filter = 'onlyColumns';
      if (table.dataSource.paginator) {
        table.dataSource.paginator.firstPage();
      }
    }
  }

  clearFilter($event: any) {
    if (this.tablePlaces != undefined) {
      let table = this.tablePlaces as unknown as TableComponent;
      table.dataSource.filterPredicate = (data: IUser, filter: string) => {
        return true;
      };
      this.applyFilter();
    }
  }

  users: IUser[] = [];

  fetchUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
      },
      error: (err: any) => {
        console.log('No se han podido cargar los usuarios');
      }
    });
  }

  addPlace() {
    let column = this.dialogConfig.columns.filter((element) => element.prop == 'persons');
    if (column != undefined && column.length > 0) {
      column[0].chipsSelecteds = [];
      this.usersService.getUsers().subscribe({
        next: (response: any) => {
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
            result.idPersons = personsIds;
            if (result) {
              delete result.id;
              this.placesService.save(result).subscribe({
                next: async (result: any) => {
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
