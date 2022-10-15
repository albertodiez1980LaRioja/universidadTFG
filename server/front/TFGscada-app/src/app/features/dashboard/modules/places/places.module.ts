import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from './places-routing.module';
import { PlacesComponent } from './places.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    PlacesComponent
  ],
  imports: [
    CommonModule,
    PlacesRoutingModule,
    MatTabsModule
  ]
})
export class PlacesModule { }
