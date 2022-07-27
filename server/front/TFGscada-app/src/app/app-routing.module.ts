import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [ 
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
        // canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canActivate: [DashboardGuard],
      },
      
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  { path: 'users', loadChildren: () => import('./features/dashboard/modules/users/users.module').then(m => m.UsersModule) },
  { path: 'places', loadChildren: () => import('./features/dashboard/modules/places/places.module').then(m => m.PlacesModule) },
  { path: 'alarms', loadChildren: () => import('./features/dashboard/modules/alarms/alarms.module').then(m => m.AlarmsModule) },
  { path: 'actions', loadChildren: () => import('./features/dashboard/modules/actions/actions.module').then(m => m.ActionsModule) },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
