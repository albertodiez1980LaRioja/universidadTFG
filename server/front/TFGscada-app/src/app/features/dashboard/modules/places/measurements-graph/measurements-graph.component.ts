import { Component, OnInit } from '@angular/core';

import { Input, OnChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single } from './data';

@Component({
  selector: 'app-measurements-graph',
  templateUrl: './measurements-graph.component.html',
  styleUrls: ['./measurements-graph.component.scss']
})
export class MeasurementsGraphComponent implements OnInit {
  single: any[] = single;
  view: [number, number] = [400, 400];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  value: number = 50;
  previousValue: number = 70;
  units: string = 'counts';

  onSelect(event: any) {
    console.log(event);
  }


  constructor() { }

  ngOnInit(): void {
  }

}
