import { Component, Input, OnInit } from '@angular/core';
import { IMeasurement } from '../places-interfaces';
import { PlacesService } from '../places.service';
import { measurementsConfig } from './measurements.config';

@Component({
  selector: 'app-place-measurements',
  templateUrl: './place-measurements.component.html',
  styleUrls: ['./place-measurements.component.scss']
})
export class PlaceMeasurementsComponent implements OnInit {
  @Input() lastMeasurements: any;

  measurementsConfig = measurementsConfig;

  readed = false;

  constructor(public placesService: PlacesService,) {

  }

  async ngOnInit() {
    await this.getMeasurements();
    const funcion = () => {
      setTimeout(() => {
        if (this.readed) {
          this.readed = false;
          this.getMeasurements();
        }
        else
          console.log('No se ha terminado de actulizar de la vez anterior');
        setTimeout(funcion, 1000);
      }, 1000);
    };
    setTimeout(funcion, 1000);
    console.log('Measurements recibidos:', this.lastMeasurements);

  }


  async getMeasurements() {
    this.placesService.getLastMeasurements(undefined).subscribe({
      next: (response: any) => {
        this.lastMeasurements = response.data;
        this.lastMeasurements.forEach((element: any) => {
          if (element.binary_values & 1)
            element.vibration = 'Si';
          else
            element.vibration = 'No';
          if (element.binary_values & 2)
            element.obstacle = 'No';
          else
            element.obstacle = 'Si';
          if (element.binary_values & 4)
            element.light = 'No';
          else
            element.light = 'Si';
          if (element.binary_values & 8)
            element.fire = 'No';
          else
            element.fire = 'Si';
          const dateSplit = element.date_time.toString().split(" ");
          const timezoneAbbr = dateSplit[dateSplit.length - 1];
        });
        this.readed = true;
      },
      error: (err: any) => {
        console.log('error', err);
        this.readed = true;
      },
      complete: () => {
        this.readed = true;
      }
    });
  }

  tableEvent(e: any) {

  }
}
