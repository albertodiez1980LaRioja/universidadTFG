import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;

  constructor() { }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  register() {
    console.log(this.email);
    console.log(this.password);
  }
}
