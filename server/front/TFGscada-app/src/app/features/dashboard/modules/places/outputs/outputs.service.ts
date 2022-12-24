import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';
import { IOutput } from './../places-interfaces';
import { rotuteToBack } from '../../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class OutputsService {
  apiUrl = 'http://' + rotuteToBack + '/api/places';

  apiUrlGet = 'http://' + rotuteToBack + '/api/places';


  constructor(private http: HttpClient) { }

  get(): Observable<HttpResponse<IOutput>> {
    return this.http.get<HttpResponse<IOutput>>(this.apiUrl);
  }

  save(place: IOutput): Observable<HttpResponse<IOutput>> {
    return this.http.post<HttpResponse<IOutput>>(this.apiUrl, place);
  }

}
