import { Component } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';

@Component({
	selector: 'dashboard-row-header',
	templateUrl: './dashboardRowHeader.html',
})
export class DashboardRowHeaderComponent {
	loginUrl = this._config.getCommonLoginUrl();
	constructor(public getCommonData: dataService, public _config: ConfigService) {

	}

	data: any = this.getCommonData.Userdata;
}