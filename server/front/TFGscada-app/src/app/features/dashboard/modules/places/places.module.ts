import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from './places-routing.module';
import { PlacesComponent } from './places.component';
//import { TableComponent } from 'src/app/shared/component/table/table.component';


import { MatTabsModule } from '@angular/material/tabs';
import { TableModule } from 'src/app/shared/component/table/table.module';


@NgModule({
  declarations: [
    PlacesComponent,
    //TableComponent
  ],
  imports: [
    CommonModule,
    PlacesRoutingModule,
    MatTabsModule, TableModule
  ]
})
export class PlacesModule { }
