import { Component, OnInit } from '@angular/core';
import { ITableConfig } from 'src/app/shared/component/table/table.interfaces';
import { UsersService } from './users.service';


import { usersConfig } from './users.config';
import { IUser } from './users-interfaces';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersConfig = usersConfig;
  usersDate: IUser[] = [];


  constructor(public usersService: UsersService) {
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        console.log('respuesta: ', response);
        this.usersDate = response.data;
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });


  }

}
