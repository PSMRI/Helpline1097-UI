/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
        if (sessionStorage.getItem('authToken')) {
            return sessionStorage.getItem('authToken');
        }
    }
    public removeToken() {
        sessionStorage.removeItem('apiman_key');
        sessionStorage.removeItem('authToken');
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
