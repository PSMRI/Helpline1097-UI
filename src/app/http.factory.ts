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

import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { InterceptedHttp } from './http.interceptor';
import { LoaderService } from './services/common/loader.service';
import { Router } from '@angular/router';
import { AuthService } from './services/authentication/auth.service';
import { ConfirmationDialogsService } from './services/dialog/confirmation.service';

export function httpFactory(xhrBackend: XHRBackend,
    requestOptions: RequestOptions, loaderService: LoaderService,
    router: Router, authService: AuthService, message: ConfirmationDialogsService): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, loaderService, router, authService, message);
}
