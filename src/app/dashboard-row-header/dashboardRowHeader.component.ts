import {Component} from '@angular/core';
import { dataService } from '../services/dataService/data.service';


@Component({
    selector: 'dashboard-row-header',
    templateUrl: './dashboardRowHeader.html',
})
export class DashboardRowHeaderComponent{
	constructor(public getCommonData:dataService)
	{

	}

	data: any = this.getCommonData.Userdata;
}