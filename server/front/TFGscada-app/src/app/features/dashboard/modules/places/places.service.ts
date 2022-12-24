import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// App own modules and services

import { Observable } from 'rxjs';
import { IPlace } from './places-interfaces';
import { rotuteToBack } from '../../../../shared/route';

// Module inner imports
//import { IService } from './services.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  apiUrl = 'http://' + rotuteToBack + '/api/places';

  apiUrlGetLastMeasurement = 'http://' + rotuteToBack + '/api/measurements/multiple';

  constructor(private http: HttpClient) { }

  getLastMeasurements(placeId: string | undefined) {
    if (placeId == undefined)
      return this.http.get<HttpResponse<any>>(this.apiUrlGetLastMeasurement);
    else
      return this.http.get<HttpResponse<any>>(this.apiUrlGetLastMeasurement + '?placeId=' + placeId);
  }

  get(): Observable<HttpResponse<IPlace>> {
    return this.http.get<HttpResponse<IPlace>>(this.apiUrl);
  }

  update(place: IPlace): Observable<HttpResponse<IPlace>> {
    return this.http.patch<HttpResponse<IPlace>>(this.apiUrl + '/' + place.id, place);
  }

  save(place: IPlace): Observable<HttpResponse<IPlace>> {
    return this.http.post<HttpResponse<IPlace>>(this.apiUrl, place);
  }

  delete(placeId: IPlace): Observable<HttpResponse<IPlace>> {
    return this.http.delete<HttpResponse<IPlace>>(this.apiUrl + '/' + placeId.toString());
  }

}
