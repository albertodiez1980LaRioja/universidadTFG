import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';

import { rotuteToBack } from '../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private header = new HttpHeaders({ 'content-type': 'application/json' });


  apiUrl = 'http://' + rotuteToBack + '/api/places';

  apiUrlGetActions = 'http://' + rotuteToBack + '/api/actions';

  constructor(private http: HttpClient) { }

  getMeasurementsRange(end: Date) {
    //return this.http.get<HttpResponse<any>>('http://' + rotuteToBack + '/api/measurements?placeId=' + placeId + '&date_timeFINISH=' + end.toString() + '&date_timeBEGIN=' + begin.toString() + '&date_timeORDERDESC=0&LIMIT=100000');
    return this.http.get<HttpResponse<any>>(this.apiUrlGetActions + '?dateFINISH=' + end.toString() + '&dateORDERDESC=0&LIMIT=1000');
  }



}
