import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token'); // you probably want to store it in localStorage or something
        if (!token) {
            return next.handle(req);
        }

        const req1 = req.clone({
            headers: req.headers.set('x-access-token', `${token}`),
        });
        return next.handle(req1);
    }
}