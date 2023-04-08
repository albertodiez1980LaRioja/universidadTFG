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
export class UsersGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.isAuthenticated()) {
            if (this.auth.user.roles != 0) // not pass if is not admin
                return false;
            return true;
        } else {
            this.router.navigate(['auth'], {
                queryParams: { returnUrl: state.url },
            });
            return false;
        }
    }
} 