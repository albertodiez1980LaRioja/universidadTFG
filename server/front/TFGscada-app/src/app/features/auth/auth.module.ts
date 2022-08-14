import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [{ path: '', pathMatch: 'full', redirectTo: 'users' },
    ],
  },
  {
    path: 'users',
    loadChildren: () => import('./auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule, MatCardModule, MatSliderModule
  ],
  exports: [RouterModule, MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule, MatCardModule, MatSliderModule,
    FormsModule, ReactiveFormsModule
  ],
})
export class AuthModule { }
