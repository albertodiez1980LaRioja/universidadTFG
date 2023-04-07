import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { binarios, DHT11, multi } from './data';
import { PlacesService } from '../places.service';
import { IPlace } from '../places-interfaces';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-measurements-graph',
  templateUrl: './measurements-graph.component.html',
  styleUrls: ['./measurements-graph.component.scss']
})
export class MeasurementsGraphComponent implements OnInit, OnChanges {

  @Input() inputMultiple = false;
  @Input() place: IPlace | undefined;
  multi = multi;
  DHT11 = DHT11;
  binarios = binarios;
  view: any[number] = [1500, 200];

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

  constructor(public placesService: PlacesService,
    private translate: TranslateService) {
    //Object.assign(this, { multi });
  }

  rest = 350;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.view[0] = window.innerWidth - this.rest;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.place) {
      this.selected = this.place.id.toString();
      this.fetchOutputs();
    }
  }

  dateTickFormatting(val: any): string {
    if (val instanceof Date) {
      return val.toISOString().substring(11, 19);
      //return val.toISOString();
    }
    return '';
  }

  pushData(array: any[], name: string, value: string, max: number | undefined, min: number | undefined, max_dates: number, response: any, inverse: number = 0, mask = 0) {
    let aux = array.find((element) => element.name == name);

    if (aux) {
      //aux.series = [];
      for (let i = 0; i < max_dates; i++) {
        let valueLocal = response.data[i][value];
        if (mask > 0)
          valueLocal = valueLocal & mask;
        if (inverse > 0)
          valueLocal = inverse - valueLocal;
        if (aux.series.length <= i) {
          aux.series.push({
            "name": new Date(response.data[i].date_time),
            "value": valueLocal
            , max: max, min: min
          });
        }
        else {
          aux.series[i].name = new Date(response.data[i].date_time);
          aux.series[i].value = valueLocal;
        }
      }
    }
  }

  allPlaces: IPlace[] = [];

  maxDate = new Date();
  minDate = new Date();



  fetchData() {
    let actualDate = new Date();
    let initDate = new Date();
    initDate.setHours(initDate.getHours() - 1);
    let id = this.selected.toString();
    if (this.realTime == 'Si')
      this.dateSelectedByUser = false;
    if (this.dateSelectedByUser) {
      actualDate = new Date(this.dateInit);
      initDate.setHours(actualDate.getHours() - 1);
    }
    this.placesService.getMeasurementsRange(id, initDate, actualDate).subscribe({
      next: (response: any) => {
        let max_dates = 100;
        let aux: any;
        if (max_dates > response.data.length)
          max_dates = response.data.length;
        if (max_dates > 0) {
          this.maxDate = response.data[0].date_time;
          this.minDate = response.data[0].date_time;
          for (let i = 1; i < max_dates; i++) {
            if (this.maxDate < response.data[i].date_time)
              this.maxDate = response.data[i].date_time;
            if (this.minDate > response.data[i].date_time)
              this.minDate = response.data[i].date_time;
          }
        }
        let init = response.data.length - 30;
        this.translate.get('place_measurements.value').subscribe((res: string) => {
          this.yAxisLabel = res;
        });
        this.translate.get('place_measurements.time').subscribe((res: string) => {
          this.xAxisLabel = res;
        });
        this.translate.get('place_measurements.personas').subscribe((res: string) => {
          this.multi[0].name = res;
          this.pushData(this.multi, res, 'has_persons', 1023, 0, max_dates, response);
        });
        this.translate.get('place_measurements.sonido').subscribe((res: string) => {
          this.multi[1].name = res;
          this.pushData(this.multi, res, 'has_sound', 1023, 0, max_dates, response);
        });
        this.translate.get('place_measurements.aceite').subscribe((res: string) => {
          this.multi[2].name = res;
          this.pushData(this.multi, res, 'has_oil', 1023, 0, max_dates, response, 1023);
        });
        this.translate.get('place_measurements.gas').subscribe((res: string) => {
          this.multi[3].name = res;
          this.pushData(this.multi, res, 'has_gas', 1023, 0, max_dates, response);
        });
        this.translate.get('place_measurements.lluvia').subscribe((res: string) => {
          this.multi[4].name = res;
          this.pushData(this.multi, res, 'has_rain', 1023, 0, max_dates, response, 1023);
        });

        this.translate.get('place_measurements.temperatura').subscribe((res: string) => {
          this.DHT11[0].name = res;
          this.pushData(this.DHT11, res, 'temperature', undefined, undefined, max_dates, response);
        });
        this.translate.get('place_measurements.humedad').subscribe((res: string) => {
          this.DHT11[1].name = res;
          this.pushData(this.DHT11, res, 'humidity', undefined, undefined, max_dates, response);
        });


        this.translate.get('place_measurements.vibracion').subscribe((res: string) => {
          this.binarios[0].name = res;
          this.pushData(this.binarios, res, 'binary_values', 1, 0, max_dates, response, 0, 1);
        });
        this.translate.get('place_measurements.obstaculos').subscribe((res: string) => {
          this.binarios[1].name = res;
          this.pushData(this.binarios, res, 'binary_values', 2, 0, max_dates, response, 2, 2);
        });
        this.translate.get('place_measurements.luz').subscribe((res: string) => {
          this.binarios[2].name = res;
          this.pushData(this.binarios, res, 'binary_values', 4, 0, max_dates, response, 4, 4);
        });
        this.translate.get('place_measurements.fuego').subscribe((res: string) => {
          this.binarios[3].name = res;
          this.pushData(this.binarios, res, 'binary_values', 8, 0, max_dates, response, 8, 8);
        });

        this.binarios = [...this.binarios];
        this.DHT11 = [...this.DHT11];
        this.multi = [...this.multi];
        this.loading = false;
      },
      error: (err) => {
        console.log('Error ', err);
      }
    });


  }

  placeSelected: any = undefined;



  fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        this.allPlaces = response.data;
        if (this.allPlaces.length > 0) {
          if (this.place == undefined) {
            this.placeSelected = this.allPlaces[0];
            this.selected = this.allPlaces[0].id.toString();
          }
          else {

            this.placeSelected = this.place;
            this.selected = this.place.id.toString();
          }
        }
      },
      error: (err) => {
        console.log('Error on load places', err);
      }
    });
  }

  selected: any = undefined;
  loading = true;
  realTime = 'Si';
  dateInit = new Date();
  dateSelectedByUser = false;

  clicked() {
    this.dateSelectedByUser = true;
    this.fetchOutputs();
  }

  fetchOutputs() {
    // reset the data
    for (let i = 0; i < this.multi.length; i++)
      this.multi[i].series = [];
    for (let i = 0; i < this.DHT11.length; i++)
      this.DHT11[i].series = [];
    for (let i = 0; i < this.binarios.length; i++)
      this.binarios[i].series = [];
    this.binarios = [...this.binarios];
    this.DHT11 = [...this.DHT11];
    this.multi = [...this.multi];
    this.loading = true;
    if (this.selected != undefined) {
      this.placeSelected = this.allPlaces.find((element) => element.id == this.selected);
    }
  }

  interval$: any;

  ngOnInit() {
    this.view[0] = window.innerWidth - this.rest;
    if (this.inputMultiple) {
      this.fetchPlaces();

    }
    this.interval$ = setInterval(() => {
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

  ngOnDestroy() {
    if (this.interval$)
      clearInterval(this.interval$);
  }

}
