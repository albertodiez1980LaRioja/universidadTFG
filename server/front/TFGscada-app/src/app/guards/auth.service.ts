// Angular imports
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

// App own modules and services imports
import { IUser } from '../features/dashboard/modules/users/users-interfaces';
import { rotuteToBack } from '../shared/route';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _user: IUser = {} as IUser;
    private language: string = 'es';

    setLanguage(lang: string) {
        this.language = lang;
    }

    getLanguage() {
        return this.language;
    }

    constructor(
        private jwtHelper: JwtHelperService,
        private http: HttpClient
    ) { }

    isAuthenticated(): boolean {
        const user = localStorage.getItem('user');
        if (user != undefined) {
            return true;
        }
        return false;
    }

    hasValidToken(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            return !this.jwtHelper.isTokenExpired(token);
        }
        return false;
    }

    authenticateUser(user_name: string, pass: string) {
        return this.http.post('http://' + rotuteToBack + '/api/persons/authenticate', { user_name, pass });
    }

    validateToken(token: string) {
        return this.http.post('http://' + rotuteToBack + '/api/persons/validateToken', { token });
    }

    set user(user: IUser) {
        this._user = user;
    }

    get user(): any {
        const item = localStorage.getItem('user');
        if (item != undefined)
            return JSON.parse(item);
        return undefined;
    }
}