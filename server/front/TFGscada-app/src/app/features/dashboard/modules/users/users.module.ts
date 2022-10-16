import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
//import { TableComponent } from 'src/app/shared/component/table/table.component';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'src/app/shared/component/table/table.module';




@NgModule({
  declarations: [
    UsersComponent,
    //TableComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,

    MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatSliderModule,
    MatToolbarModule, MatInputModule, MatPaginatorModule, MatTooltipModule,
    MatChipsModule, MatTableModule, MatCheckboxModule, MatProgressSpinnerModule,
    MatSortModule, FormsModule, MatDialogModule, TableModule
  ],
})
export class UsersModule {
  constructor() {
  }


}
