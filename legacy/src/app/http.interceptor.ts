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


/*
* Created by Pankush Manchanda 10,August 2017
* Http Interceptor to add diffrent function to http request like passing option in every request
* Advantage : Used to remove the code duplication
*/

import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { LoaderService } from './services/common/loader.service';
import { Router } from '@angular/router';
import { AuthService } from './services/authentication/auth.service';
import { ConfirmationDialogsService } from './services/dialog/confirmation.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'
import { sessionStorageService } from './services/sessionStorageService/session-storage.service';
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Injectable()
export class InterceptedHttp extends Http {

    onlineFlag: boolean = true;
    count = 0;
    _count = 0;
    assignSelectedLanguageValue: any ;

    constructor(backend: ConnectionBackend, 
        defaultOptions: RequestOptions, 
        private loaderService: LoaderService, 
        private router: Router, 
        private authService: AuthService, 
        private message: ConfirmationDialogsService, 
        private sessionstorage: sessionStorageService,
        private httpServices: HttpServices) {
        super(backend, defaultOptions);
    }

    assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServices);
        getLanguageJson.setLanguage();
        this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
    }

    ngDoCheck() {
        this.assignSelectedLanguage();
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        if (this.networkCheck()) {
            this.showLoader();
            return super.get(url, this.getRequestOptionArgs(options, url)).catch(this.onCatch)
                .do((res: Response) => {
                    this.onSuccess(res);
                }, (error: any) => {
                    this.onError(error);
                })
                .finally(() => {
                    this.onEnd();
                });
        }
        else {
            return Observable.empty();
        }
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        if (this.networkCheck()) {
            this.showLoader();
            return super.post(url, body, this.getRequestOptionArgs(options,url)).catch(this.onCatch).do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
                .finally(() => {
                    this.onEnd();
                });
        }
        else {
            return Observable.empty();
        }
    }

    postEverwell(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        if (this.networkCheck()) {
            this.showLoader();
            return super.post(url, body, this.getRequestOptionArgs(options,url)).catch(this.onCatch).do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
                .finally(() => {
                    //    this.onEnd();
                });
        }
        else {
            return Observable.empty();
        }
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options,url)).catch(this.onCatch).do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
            .finally(() => {
                this.onEnd();
            });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options,url)).catch(this.onCatch).do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
            .finally(() => {
                this.onEnd();
            });
    }

    // private updateUrl(req: string) {
    //     return environment.origin + req;
    // }
    private updateUrl(url) {
        if (sessionStorage.getItem('apiman_key') != undefined && sessionStorage.getItem('apiman_key') != null) {
            url = url + '?apikey=' + sessionStorage.getItem('apiman_key');
            return url;
        }
        return url;
    }
    private getRequestOptionArgs(options?: RequestOptionsArgs, url?: string): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
    
    // let cvalue="";
    // var nameEQ = 'Jwttoken' + "=";
    // var ca = document.cookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //   var c = ca[i];
    //   while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    //   if (c.indexOf(nameEQ) == 0) cvalue= c.substring(nameEQ.length, c.length);
    // }

    //     console.error(" Jwt_token",cvalue);
    //     let Jwt_token: any;
    //     if (cvalue && cvalue!== null) {

    //         Jwt_token = cvalue;
            
    //     }
        // Determine whether we should skip attaching Authorization header
        const skipAuth = url && url.indexOf('platform-feedback') !== -1;

        let authToken: any;
        if (!skipAuth && sessionStorage.getItem('authToken')) {
            authToken = sessionStorage.getItem('authToken');
        }

        options.headers.append('Content-Type', 'application/json');
        // options.headers.append('Access-Control-Allow-Origin', '*');
        options.headers.append('Authorization', authToken);
        // options.headers.append('Jwttoken', Jwt_token);
        return options;
    }
    private onEnd(): void {
        this.hideLoader();
    }
    private onSuccess(response: any) {
        if (response.json().statusCode === 200) {
            // this._count = 0;
            return response;
        }
        else if (response.json().statusCode === 5002) {
            if (response.json().errorMessage === 'You are already logged in,please confirm to logout from other device and login again' || response.json().errorMessage === 'Invalid username or password') {
                this.message
                    .confirm('info', response.json().errorMessage)
                    .subscribe((confirmResponse) => {
                        if (confirmResponse) {
                            this.dologoutUsrFromPreSession(true);
                        }
                    });
            } else {
                this.router.navigate(['']);
                if (this._count == 0) {
                    this._count = this._count + 1;
                }
                if (!(response.json().data && response.json().data.response == "User successfully logged out")) {
                    this.message.alert('Session expired, please login again', 'error');
                }
                this.authService.removeToken();
            }
            return Observable.empty();
        }
        else if (response.json().statusCode === 5006) {
            throw response.json();
        }
        else {
            throw response;
        }
    }
    private onError(error: any) {
        this.hideLoader();
        if (error.status === 401 || error.status === 403) {
            this.message.alert('Your session has expired. Please login again.', 'error');
            this.authService.removeToken();
            sessionStorage.clear();
            this.router.navigate(['']);
            return error;
        }
        return error;
    }
    private showLoader(): void {
        console.log('show loader');
        this.loaderService.show();
    }
    private hideLoader(): void {
        console.log('Loader hide')
        this.loaderService.hide();
    }
    private onCatch(error: any, caught?: Observable<Response>): Observable<Response> {
        return Observable.throw(error);
    }
    private networkCheck(): boolean {
        if (!this.onlineFlag) {
            // if (this.count === 0) {
            this.message.alert("You are offline. Please check");
            // this.count++;
            // }
            return false;
        }
        else {
            // this.count = 0;
            return true;
        }
    }
    dologout: any = false;
    logoutUserFromPreviousSession = new BehaviorSubject(this.dologout);
    logoutUserFromPreviousSessions$ =
        this.logoutUserFromPreviousSession.asObservable();
    dologoutUsrFromPreSession(dologout) {
        this.dologout = dologout;
        this.logoutUserFromPreviousSession.next(dologout);
    }
}
