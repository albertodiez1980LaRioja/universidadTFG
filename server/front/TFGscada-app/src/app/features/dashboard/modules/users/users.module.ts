import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { TableComponent } from 'src/app/shared/component/table/table.component';



@NgModule({
  declarations: [
    UsersComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {
  constructor() {
  }


}
