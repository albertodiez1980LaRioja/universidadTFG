// Angular imports
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

// Third-party libraries imports
import { Observable } from 'rxjs';

// App own modules and services imports
import { IUser } from '../features/dashboard/modules/users/users-interfaces';
//import { IResponse } from '@shared/interfaces/api.interfaces';

// Module inner imports
//import { ApiService } from './api.service';

interface TokenUser {
    token: string;
    user: IUser;
}
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _user: IUser = {} as IUser;

    constructor(
        private jwtHelper: JwtHelperService,
        private http: HttpClient
        //private api: ApiService<TokenUser>
    ) { }

    isAuthenticated(): boolean {
        return Object.keys(this._user).length > 0;
    }

    hasValidToken(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            return !this.jwtHelper.isTokenExpired(token);
        }
        return false;
    }

    authenticateUser(
        user_name: string,
        pass: string
    ) {
        return this.http.post('persons/authenticate', { user_name, pass });
    }
    /*
    validateToken(): Observable<IResponse<TokenUser>> {
        return this.api.read('users/token');
    }
    */
    set user(user: IUser) {
        this._user = user;
    }

    get user(): IUser {
        return this._user;
    }
}