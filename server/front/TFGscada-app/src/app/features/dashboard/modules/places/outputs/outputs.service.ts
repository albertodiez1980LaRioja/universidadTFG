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
  apiUrl = 'http://' + rotuteToBack + '/api/actions/place/place';

  apiUrlPost = 'http://' + rotuteToBack + '/api/actions';

  apiUrlPostOutputs = 'http://' + rotuteToBack + '/api/outputs';


  constructor(private http: HttpClient) { }

  get(idPlace: number): Observable<HttpResponse<IOutput>> {
    return this.http.get<HttpResponse<IOutput>>(this.apiUrl + '?id_place=' + idPlace.toString());
  }

  getOutputs(): Observable<HttpResponse<IOutput>> {
    return this.http.get<HttpResponse<IOutput>>(this.apiUrlPostOutputs);
  }

  post(place: IOutput): Observable<HttpResponse<IOutput>> {
    return this.http.post<HttpResponse<IOutput>>(this.apiUrlPost, place);
  }

}
