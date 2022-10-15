import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.isAuthenticated()) {
            return true;
        } else {
            console.log('se navega a auth', route.url);
            this.router.navigate(['auth'], {
                queryParams: { returnUrl: state.url },
            });
            return false;
        }
    }
} 