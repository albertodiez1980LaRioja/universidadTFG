import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { TableComponent } from 'src/app/shared/component/table/table.component';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    UsersComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,

    MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatSliderModule,
    MatToolbarModule, MatInputModule
  ],
})
export class UsersModule {
  constructor() {
  }


}
