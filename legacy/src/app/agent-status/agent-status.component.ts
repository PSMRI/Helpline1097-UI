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
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: ['./agent-status.component.css']
})
export class AgentStatusComponent implements OnInit {
  agentStatusURL: any;
  selection: any = "";
  currentLanguageSet: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer, private saved_data: dataService,private HttpServices:HttpServices
  ) { }
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
    this.agentStatusURL = "http://10.201.13.17/adminui.php?agentStatus";
    let url = this.configService.getTelephonyServerURL() + "adminui.php?agentStatus";
    console.log("url = " + url);
    this.agentStatusURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
