import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { UsersService } from './users.service';

import { usersConfig, dialogConfig } from './users.config';
import { IUser, RoleText } from './users-interfaces';
import { TableComponent } from 'src/app/shared/component/table/table.component';
import { DialogComponent } from 'src/app/shared/component/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersConfig = usersConfig;
  dialogConfig = dialogConfig;
  roleText = RoleText;
  usersDate: IUser[] = [];


  constructor(public usersService: UsersService,
    private dialog: MatDialog
  ) {
  }

  fetchUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        console.log('respuesta: ', response);
        this.usersDate = response.data;
        this.usersDate.forEach(user => {
          if (user.roles < this.roleText.length)
            user.roleText = this.roleText[user.roles];
          else
            user.roleText = 'Desconocido';
        });
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  @ViewChild("tableUsers") tableUsers: ElementRef | undefined;

  applyFilter() {
    if (this.tableUsers != undefined) {
      let table = this.tableUsers as unknown as TableComponent;
      table.dataSource.filter = 'onlyColumns';
      if (table.dataSource.paginator) {
        table.dataSource.paginator.firstPage();
      }
    }
  }

  read_prop(obj: any, id: any) {
    if (id != undefined)
      return obj[id];
    return undefined;
  }

  clickSearch($event: any) {
    this.dialogConfig.action = 'search';
    this.dialogConfig.editable = true;
    for (let i = 0; i < this.dialogConfig.columns.length; i++) {
      this.dialogConfig.columns[i].value = '';
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.dialogConfig,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result != '') {
        // save the row
        console.log('llegados para la busqueda: ', result);
        let user = result;
        const keys = Object.keys(result);
        if (user['pass'] == undefined || user['pass'] == '')
          delete user['pass'];
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] == 'roleText') {
            user['roles'] = this.roleText.indexOf(result[keys[i]]);
          }
        }
        if (this.tableUsers != undefined) {
          let table = this.tableUsers as unknown as TableComponent;
          table.dataSource.filterPredicate = (data: IUser, filter: string) => {
            let keys = Object.keys(data);
            console.log(keys, result);
            for (let i = 0; i < keys.length; i++) {
              let value = this.read_prop(result, keys[i]);
              if (value != undefined && value != '' && keys[i] != 'id' && !(keys[i] == 'roles' && value == -1)) {
                console.log(value, this.read_prop(data, keys[i]));
                if (!this.read_prop(data, keys[i]).toString().toLowerCase().includes(value.toString().toLowerCase()))
                  return false;
              }
            }
            console.log(data, filter, keys);
            if (data.dni == user.dni)
              return true;
            return true;
          };
          this.applyFilter();
        }
      }
    });
  }

  clearFilter($event: any) {
    if (this.tableUsers != undefined) {
      let table = this.tableUsers as unknown as TableComponent;
      table.dataSource.filterPredicate = (data: IUser, filter: string) => {
        return true;
      };
      this.applyFilter();
    }
  }

  addPerson() {
    this.dialogConfig.action = 'insert';
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.dialogConfig,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        // save the row
        let user = result;
        const keys = Object.keys(result);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] == 'roleText') {
            user['roles'] = this.roleText.indexOf(result[keys[i]]);
          }
        }
        this.usersService.saveUser(user).subscribe({
          next: async (result: any) => {
            console.log(result);
            this.fetchUsers();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      }
    });
  }

  async tableEvent($event: any) {
    console.log('Evento de la tabla: ', $event);
    switch ($event.action) {
      case 'Update':
        this.dialogConfig.action = 'update';
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
        });
        break;
      case 'Delete':
        this.usersService.deleteUser($event.row.id).subscribe({
          next: (result: any) => {
            console.log(result);
            this.fetchUsers();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
        break;
      case 'View':
        this.dialogConfig.action = 'view';
        this.dialogConfig.editable = false;
        for (let i = 0; i < this.dialogConfig.columns.length; i++) {
          this.dialogConfig.columns[i].value = $event.row[this.dialogConfig.columns[i].prop];
        }
        const dialogRef2 = this.dialog.open(DialogComponent, {
          data: this.dialogConfig,
        });
        break;
    }
  }
}
