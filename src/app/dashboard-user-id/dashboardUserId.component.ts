import { Component } from '@angular/core';
import { dataService } from '../services/dataService/data.service';

@Component( {
    selector: 'dashboard-user-id',
    templateUrl: './dashboardUserId.html',
} )
export class DashboardUserIdComponent
{
    current_service: any;
    current_role: any;
    constructor(
        public dataSettingService: dataService
    )
    {
        this.current_service = this.dataSettingService.current_service.serviceName;
        this.current_role = this.dataSettingService.current_role.RoleName;
    };
}