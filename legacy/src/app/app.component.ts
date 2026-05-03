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


import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './authorization.wrapper';
import { InterceptedHttp } from './http.interceptor';
@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
} )
export class AppComponent
{
  cZentrix = true;
  isConnected: Observable<boolean>;

  constructor(private httpInterceptor: InterceptedHttp, private securityInterceptor: AuthorizationWrapper){
    this.isConnected = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));
  }
  ngOnInit(){
    this.isConnected.subscribe((bool)=>{
      this.httpInterceptor.onlineFlag = bool;
      this.securityInterceptor.onlineFlag = bool;
    });
  }
}
