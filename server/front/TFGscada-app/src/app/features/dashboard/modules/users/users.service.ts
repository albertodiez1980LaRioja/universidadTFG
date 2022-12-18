import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';
import { IUser } from './users-interfaces';
import { rotuteToBack } from '../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'http://' + rotuteToBack + '/api/persons';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<HttpResponse<IUser>> {
    return this.http.get<HttpResponse<IUser>>(this.apiUrl);
  }

  updateUser(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.patch<HttpResponse<IUser>>(this.apiUrl + '/' + user.id, user);
  }

  saveUser(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<HttpResponse<IUser>>(this.apiUrl, user);
  }

  deleteUser(userId: number): Observable<HttpResponse<IUser>> {
    return this.http.delete<HttpResponse<IUser>>(this.apiUrl + '/' + userId.toString());
  }

}
