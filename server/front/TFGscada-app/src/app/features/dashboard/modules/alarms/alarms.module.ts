import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmsRoutingModule } from './alarms-routing.module';
import { AlarmsComponent } from './alarms.component';


@NgModule({
  declarations: [
    AlarmsComponent
  ],
  imports: [
    CommonModule,
    AlarmsRoutingModule
  ]
})
export class AlarmsModule { }
