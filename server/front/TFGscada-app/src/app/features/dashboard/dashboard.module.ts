import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [{ path: '', pathMatch: 'full', redirectTo: 'users' },
    { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
    { path: 'places', loadChildren: () => import('./modules/places/places.module').then(m => m.PlacesModule) },
    { path: 'alarms', loadChildren: () => import('./modules/alarms/alarms.module').then(m => m.AlarmsModule) },
    { path: 'actions', loadChildren: () => import('./modules/actions/actions.module').then(m => m.ActionsModule) },
    ],
  },
  /*{
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule, MatCardModule, MatSliderModule,
  ],
  exports: [RouterModule, MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule, MatCardModule, MatSliderModule,
    FormsModule, ReactiveFormsModule,
  ],
})

export class DashboardModule { }
