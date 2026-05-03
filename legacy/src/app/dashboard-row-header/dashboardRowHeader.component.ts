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


import { Component } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { ConfigService } from "../services/config/config.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "dashboard-row-header",
  templateUrl: "./dashboardRowHeader.html",
})
export class DashboardRowHeaderComponent {
  data: any = this.getCommonData.Userdata;
  currentLanguageSet: any;
  constructor(
    public getCommonData: dataService,
    public _config: ConfigService,
    private httpServices: HttpServices
  ) {}
  ngOninit() {
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
  logOut() {
    // Cookie.deleteAll();
    // this.router.navigate(['/MultiRoleScreenComponent/roleSelection']);
    // location.assign(this.loginUrl);
  }
}
