import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlarm } from './alarms-interfaces';

// App own modules and services

import { Observable } from 'rxjs';
import { rotuteToBack } from '../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {
  apiUrl = 'http://' + rotuteToBack + '/api/alarms';

  constructor(private http: HttpClient) { }
  get(dateInit: Date, date_finish: Date, limit: number): Observable<HttpResponse<any>> {
    const aux = this.apiUrl + '?LIMIT=' +
      limit.toString() + '&date_timeORDERDESC=0&date_timeFINISH=' +
      dateInit.toISOString() + '&date_timeBEGIN=' + date_finish.toISOString();
    return this.http.get<HttpResponse<any>>(aux);
  }

  update(id: string, alarm: any) {
    return this.http.patch<HttpResponse<IAlarm>>(this.apiUrl + '/' + id, alarm);
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
