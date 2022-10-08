import { Component, OnInit } from '@angular/core';
import { ITableConfig } from 'src/app/shared/component/table/table.interfaces';
import { UsersService } from './users.service';


import { usersConfig, } from './users.config';
import { IUser, RoleText } from './users-interfaces';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersConfig = usersConfig;
  roleText = RoleText;
  usersDate: IUser[] = [];


  constructor(public usersService: UsersService) {
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

}
