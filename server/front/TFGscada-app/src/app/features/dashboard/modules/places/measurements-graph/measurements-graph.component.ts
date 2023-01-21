import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { binarios, DHT11, multi } from './data';
import { PlacesService } from '../places.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-measurements-graph',
  templateUrl: './measurements-graph.component.html',
  styleUrls: ['./measurements-graph.component.scss']
})
export class MeasurementsGraphComponent implements OnInit {

  multi = multi;
  DHT11 = DHT11;
  binarios = binarios;
  //multi = [];
  view: any[number] = [1400, 600];
  //view = [undefined, undefined];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Tiempo';
  yAxisLabel: string = 'Valor';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(public placesService: PlacesService) {
    //Object.assign(this, { multi });
  }

  dateTickFormatting(val: any): string {
    if (val instanceof Date) {
      return val.toISOString().substring(11, 19);
    }
    return '';
  }

  fetchData() {
    console.log('Se actualizan los datos');
    let actualDate = new Date();
    let initDate = new Date();
    initDate.setHours(initDate.getDate() - 1);
    this.placesService.getMeasurementsRange('1', initDate, actualDate).subscribe({
      next: (response: any) => {
        let max_dates = 100;
        if (max_dates > response.data.length)
          max_dates = response.data.length;
        console.log('Respuesta ', response.data.length, response);
        console.log(response.data[response.data.length - 1].has_oil);
        let init = response.data.length - 30;
        let aux = this.multi.find((element) => element.name == 'Personas');
        if (aux) {
          aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            aux.series.push({
              "name": new Date(response.data[i].date_time),
              "value": response.data[i].has_persons
            });
          }

        }
        else
          console.log('personas no encontrado');
        aux = this.multi.find((element) => element.name == 'Sonido');
        if (aux) {
          aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            aux.series.push({
              "name": new Date(response.data[i].date_time),
              "value": response.data[i].has_sound
            });
          }
        }
        aux = this.multi.find((element) => element.name == 'Aceite');
        if (aux) {
          aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            aux.series.push({
              "name": new Date(response.data[i].date_time),
              "value": response.data[i].has_oil
            });
          }
        }
        aux = this.multi.find((element) => element.name == 'Gas');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length <= i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_gas
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].has_gas;
            }
          }
        }
        aux = this.multi.find((element) => element.name == 'Lluvia');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].has_rain;
            }
          }
        }

        aux = this.DHT11.find((element) => element.name == 'Temperatura');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].temperature;
            }
          }
        }
        aux = this.DHT11.find((element) => element.name == 'Humedad');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].humidity;
            }
          }
        }

        aux = this.binarios.find((element) => element.name == 'Vibración');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].binary_values & 1;
            }
          }
        }

        aux = this.binarios.find((element) => element.name == 'Obstáculos');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].binary_values & 2;
            }
          }
        }

        aux = this.binarios.find((element) => element.name == 'Luz');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].binary_values & 4;
            }
          }
        }

        aux = this.binarios.find((element) => element.name == 'Fuego');
        if (aux) {
          //aux.series = [];
          for (let i = 0; i < max_dates; i++) {
            if (aux.series.length == i) {
              aux.series.push({
                "name": new Date(response.data[i].date_time),
                "value": response.data[i].has_rain
              });
            }
            else {
              aux.series[i].name = new Date(response.data[i].date_time);
              aux.series[i].value = response.data[i].binary_values & 8;
            }
          }
        }

        this.binarios = [...this.binarios];
        this.DHT11 = [...this.DHT11];
        this.multi = [...this.multi];
      },
      error: (err) => {
        console.log('Error ', err);
      }
    });


  }

  ngOnInit() {
    setInterval(() => {
      this.fetchData();
    }, 3000);

  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
