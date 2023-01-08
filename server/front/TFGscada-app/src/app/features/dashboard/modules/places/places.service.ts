import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';
import { IOP, IPlace } from './places-interfaces';
import { rotuteToBack } from '../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private header = new HttpHeaders({ 'content-type': 'application/json' });

  apiUrl = 'http://' + rotuteToBack + '/api/places';
  apiUrlOP = 'http://' + rotuteToBack + '/api/o_p';

  apiUrlGetLastMeasurement = 'http://' + rotuteToBack + '/api/measurements/multiple';

  constructor(private http: HttpClient) { }

  getMeasurementsRange(placeId: string, begin: Date, end: Date) {
    return this.http.get<HttpResponse<any>>('');
  }

  getLastMeasurements(placeId: string | undefined) {
    if (placeId == undefined)
      return this.http.get<HttpResponse<any>>(this.apiUrlGetLastMeasurement);
    else
      return this.http.get<HttpResponse<any>>(this.apiUrlGetLastMeasurement + '?placeId=' + placeId);
  }

  get(): Observable<HttpResponse<IPlace>> {
    return this.http.get<HttpResponse<IPlace>>(this.apiUrl);
  }

  update(place: any): Observable<HttpResponse<IPlace>> {
    console.log('se envia en el update', place);
    return this.http.patch<HttpResponse<IPlace>>(this.apiUrl + '/' + place.id, place, { headers: this.header });
  }

  save(place: IPlace): Observable<HttpResponse<IPlace>> {
    return this.http.post<HttpResponse<IPlace>>(this.apiUrl, place);
  }

  saveOP(op: IOP): Observable<HttpResponse<IPlace>> {
    return this.http.post<HttpResponse<IPlace>>(this.apiUrlOP, op);
  }

  delete(placeId: IPlace): Observable<HttpResponse<IPlace>> {
    return this.http.delete<HttpResponse<IPlace>>(this.apiUrl + '/' + placeId.toString());
  }

}
