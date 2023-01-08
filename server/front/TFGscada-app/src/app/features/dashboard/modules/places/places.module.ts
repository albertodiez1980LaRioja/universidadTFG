import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from './places-routing.module';
import { PlacesComponent } from './places.component';
//import { TableComponent } from 'src/app/shared/component/table/table.component';


import { MatTabsModule } from '@angular/material/tabs';
import { TableModule } from 'src/app/shared/component/table/table.module';
import { PlaceMeasurementsComponent } from './place-measurements/place-measurements.component';
import { MapComponent } from './map/map.component';
import { OutputsComponent } from './outputs/outputs.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MeasurementsGraphComponent } from './measurements-graph/measurements-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    PlacesComponent,
    PlaceMeasurementsComponent,
    MapComponent,
    OutputsComponent,
    MeasurementsGraphComponent,
    //TableComponent
  ],
  imports: [
    CommonModule,
    PlacesRoutingModule,
    MatTabsModule, TableModule, MatSlideToggleModule,
    MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatSliderModule,
    MatToolbarModule, MatInputModule, MatPaginatorModule, MatTooltipModule,
    MatChipsModule, MatTableModule, MatCheckboxModule, MatProgressSpinnerModule,
    MatSortModule, FormsModule, MatDialogModule, TableModule, MatSelectModule,
    NgxChartsModule, BrowserAnimationsModule
  ]
})
export class PlacesModule { }
