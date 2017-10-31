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
    loginUrl = this._config.getCommonLoginUrl();
    currentRole: any;
    leftNavigation: boolean = true;
    constructor(private _config: ConfigService, private router: Router, private data_service: dataService) {

    }
    ngOnInit() {
        if (this.data_service.current_role) {
            this.currentRole = this.data_service.current_role.RoleName;
            if (this.currentRole.toLowerCase().trim() === 'co') {
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
