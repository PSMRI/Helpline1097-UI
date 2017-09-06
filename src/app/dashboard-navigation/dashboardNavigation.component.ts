import { Component } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ConfigService } from './../services/config/config.service';
import { Router } from '@angular/router';

@Component({
    selector: 'dashboard-navigation',
    templateUrl: './dashboardNavigation.html',
})
export class DashboardNavigationComponent {
    loginUrl = this._config.getCommonLoginUrl();
    constructor(private _config: ConfigService, private router: Router) {

    }
    changeRole() {
        this.router.navigate(['/MultiRoleScreenComponent']);
        Cookie.deleteAll();
        // location.assign(this.loginUrl);
    }
}