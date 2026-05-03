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


// import { Injectable } from '@angular/core';
// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { ConfigService } from '../config/config.service';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import { InterceptedHttp } from './../../http.interceptor';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthoriseService {
//     // _baseUrl = this._config.get1097BaseURL();
//     // _commonURL = this._config.getCommonBaseURL();
//     // _validateToken = this._commonURL + '/user/getLoginResponse';
//     // _deleteTokenUrl = this._commonURL + '/user/userLogout';
//     // constructor(private _http: InterceptedHttp, private _config: ConfigService) { };

//     public getToken(): string {
//         if (localStorage.getItem('authToken')) {
//             return localStorage.getItem('authToken');
//         }
//     }
//     public removeToken() {
//         this.deleteToken();
//     }
//     public isAuthenticated() {
//         // get the token
//         const token = this.getToken();
//         // this._http.post(this._validateToken, token).map(this.extractData).catch(this.handleCustomError);
//         // return a boolean reflecting
//         // whether or not the token is expired
//         // return tokenNotExpired(null, token);
//     }
//     public deleteToken() {
//         const token = this.getToken();
//         // this._http.post(this._deleteTokenUrl, token).map(this.extractData).catch(this.handleCustomError);
//     }
//     extractData(response: Response) {
//         debugger;
//         if (response.json().data) {
//             localStorage.removeItem('authToken');
//         } else {
//             alert('error in delete key');
//         }
//     }
//     handleCustomError(error: Response) {
//         return Observable.throw(error.json());
//     }
// }
