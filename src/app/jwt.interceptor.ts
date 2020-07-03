import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let customer = JSON.parse(localStorage.getItem('alphalex_mobile_customer'));
        if (customer && customer.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${customer.token}`
                }
            });
        }

        return next.handle(request);
    }
}