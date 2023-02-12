import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISensor } from '../interfaces/sersors.interfaces';

// App own modules and services

import { Observable } from 'rxjs';
import { rotuteToBack } from '../route';



@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  apiUrl = 'http://' + rotuteToBack + '/api/sensors';

  constructor(private http: HttpClient) { }
  get(): Observable<HttpResponse<ISensor>> {
    return this.http.get<HttpResponse<ISensor>>(this.apiUrl);
  }

  /*
    getOutputs(): Observable<HttpResponse<IOutput>> {
      return this.http.get<HttpResponse<IOutput>>(this.apiUrlPostOutputs);
    }
  
    post(place: IOutput): Observable<HttpResponse<IOutput>> {
      return this.http.post<HttpResponse<IOutput>>(this.apiUrlPost, place);
    }
  */
}
