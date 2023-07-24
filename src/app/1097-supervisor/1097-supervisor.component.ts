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


import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-1097-supervisor',
  templateUrl: './1097-supervisor.component.html',
  styleUrls: ['./1097-supervisor.component.css']
})
export class helpline1097SupervisorComponent implements OnInit {
  Activity_Number: any;
  // barMinimized: boolean = false;

  ssoURL: any;
  isLoggedIn: any;
  currentLanguageSet: any;

  constructor(private configService: ConfigService,
    public sanitizer: DomSanitizer, private saved_data: dataService,
    private http: Http,private HttpServices:HttpServices) {
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.Activity_Number = 3;

    this.ssoURL = this.configService.getTelephonyServerURL() + 'remote_login.php?username='
      + this.saved_data.uname + '&key=' + this.saved_data.loginKey;

    this.http.get(this.ssoURL).map(this.handleGetSuccess)
      .catch(this.handleGetError);
    this.ssoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.ssoURL);
    console.log('reportsURL: ' + this.ssoURL);
  }

  handleGetSuccess(response) {
    try {
      response.json();
      this.isLoggedIn = false;
    } catch (e) {
      this.isLoggedIn = true;
    }
  }


  handleGetError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }




  show(value) {
    this.Activity_Number = value;
  }
}
