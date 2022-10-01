import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(public usersService: UsersService) {
    this.usersService.getUsers()/*.subscribe({
      next: (response) => {
        console.log('respuesta: ', response);
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });*/
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        console.log('respuesta: ', response);
      },
      error: (err) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });


  }

}
