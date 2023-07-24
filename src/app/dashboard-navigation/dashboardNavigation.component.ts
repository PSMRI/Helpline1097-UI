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
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ConfigService } from './../services/config/config.service';
import { Router } from '@angular/router';
import { dataService } from './../services/dataService/data.service';
@Component({
    selector: 'dashboard-navigation',
    templateUrl: './dashboardNavigation.html',
})
export class DashboardNavigationComponent implements OnInit {
    // loginUrl = this._config.getCommonLoginUrl();
    currentRole: any;
    leftNavigation: boolean = true;
    constructor(private _config: ConfigService, private router: Router, private data_service: dataService) {

    }
    ngOnInit() {
        if (this.data_service.current_role) {
            this.currentRole = this.data_service.current_role.RoleName;
            if (this.currentRole !=undefined && this.currentRole !=null && this.currentRole.toLowerCase().trim() === 'co') {
                this.leftNavigation = true;
            } else {
                this.leftNavigation = false;
            }
        }
    }
    changeRole() {
        this.router.navigate(['/MultiRoleScreenComponent']);
        // Cookie.deleteAll();

    }
    // location.assign(this.loginUrl);
}
