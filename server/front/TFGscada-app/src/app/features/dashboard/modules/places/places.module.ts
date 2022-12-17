import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from './places-routing.module';
import { PlacesComponent } from './places.component';
//import { TableComponent } from 'src/app/shared/component/table/table.component';


import { MatTabsModule } from '@angular/material/tabs';
import { TableModule } from 'src/app/shared/component/table/table.module';
import { PlaceMeasurementsComponent } from './place-measurements/place-measurements.component';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    PlacesComponent,
    PlaceMeasurementsComponent,
    MapComponent,
    //TableComponent
  ],
  imports: [
    CommonModule,
    PlacesRoutingModule,
    MatTabsModule, TableModule
  ]
})
export class PlacesModule { }
