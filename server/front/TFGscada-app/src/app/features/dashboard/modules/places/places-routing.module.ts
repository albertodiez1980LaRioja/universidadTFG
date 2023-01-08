import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesComponent } from './places.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { NGXChartsComponent } from ".,/../ngx-charts/ngx-charts.component";

const routes: Routes = [{ path: '', component: PlacesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), NgxChartsModule],
  exports: [RouterModule]
})
export class PlacesRoutingModule { }
