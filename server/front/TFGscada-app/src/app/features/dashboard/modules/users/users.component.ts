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

  ngOnInit(): void {
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

  clickSearch($event: any) {
    console.log($event);
    if (this.tableUsers != undefined) {
      let table = this.tableUsers as unknown as TableComponent;
      table.dataSource.filterPredicate = (data: IUser, filter: string) => {
        if (data.dni == '16603537')
          return true;
        return false;
      };
      this.applyFilter();
    }
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

  tableEvent($event: any) {
    console.log('Evento de la tabla: ', $event);
    switch ($event.action) {
      case 'Update':
        for (let i = 0; i < this.dialogConfig.columns.length; i++) {
          this.dialogConfig.columns[i].value = $event.row[this.dialogConfig.columns[i].prop];
        }
        const dialogRef = this.dialog.open(DialogComponent, {
          data: this.dialogConfig,
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
          // save the row
        });
        break;
      case 'Delete':
        break;
      case 'View':
        break;

    }
  }

}
