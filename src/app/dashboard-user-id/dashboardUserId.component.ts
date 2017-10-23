import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';

@Component({
    selector: 'dashboard-user-id',
    templateUrl: './dashboardUserId.html',
})
export class DashboardUserIdComponent implements OnInit {
    current_service: any;
    current_role: any;
    status: any;
    constructor(
        public dataSettingService: dataService,
        private Czentrix: CzentrixServices
    ) {
        this.current_service = this.dataSettingService.current_service.serviceName;
        this.current_role = this.dataSettingService.current_role.RoleName;

    };
    ngOnInit() {
        this.getAgentStatus()
    }
    getAgentStatus() {
        this.Czentrix.getAgentStatus().subscribe((res) => {
            this.status = res.data.state.split('###')[0];
        }, (err) => {

        })
    }
}