import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
@Injectable()
export class AuthService {

    public getToken(): string {
        if (localStorage.getItem('authToken')) {
            return localStorage.getItem('authToken');
        }
    }
    public removeToken() {
        sessionStorage.removeItem('apiman_key');
        localStorage.removeItem('authToken');
    }
    public isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        return true;
        // return a boolean reflecting
        // whether or not the token is expired
        // return tokenNotExpired(null, token);
    }
}
