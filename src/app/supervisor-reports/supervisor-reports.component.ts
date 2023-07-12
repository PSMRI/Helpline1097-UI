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


import { Component, DoCheck, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-supervisor-reports',
  templateUrl: './supervisor-reports.component.html',
  styleUrls: ['./supervisor-reports.component.css']
})
export class SupervisorReportsComponent implements OnInit, DoCheck {
  // http://10.201.13.17/adminui.php?reportUI
  reportsURL: any;
  currentLanguageSet: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private saved_data: dataService,
    private httpServices: HttpServices
  ) { }

  ngOnInit() {
    // this.reportsURL = this.configService.getTelephonyServerURL() + 'remote_login.php?username='
    //   + this.saved_data.uname + '&key=' + this.saved_data.loginKey;
    // this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportsURL);
    // console.log('reportsURL: ' + this.reportsURL);
    let url = this.configService.getTelephonyServerURL() + "adminui.php?reportUI";
    console.log("url = " + url);
    this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	}
}
