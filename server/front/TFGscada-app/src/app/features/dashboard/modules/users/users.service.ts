import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';
import { IUser } from './users-interfaces';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'http://localhost:3000/api/persons';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<HttpResponse<IUser>> {
    return this.http.get<HttpResponse<IUser>>(this.apiUrl);
  }
}
