import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ListnerService } from './../services/common/listner.service';

@Component({
    selector: 'app-service-role-selection',
    templateUrl: './service-role-selection.component.html',
    styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {
    privleges: any;
    constructor(
        public getCommonData: dataService,
        public router: Router,
        private listnerService: ListnerService
    ) { }

    ngOnInit() {

        this.privleges = this.getCommonData.userPriveliges;
        // this.privleges[3].roles[1].RoleName = 'Supervisor';

    }

    route2dashboard(role, service) {
        let roleName = role.RoleName;
        let serviceName = service.serviceName;
        // if ( service === '1097' && ( role === 'CO' || role === 'Supervisor' ) )
        if (serviceName === '1097' && (roleName.toLowerCase().trim() === 'co' || roleName.toLowerCase().trim() === 'supervisor')) {
            // this is to hide the c-zentrix bar on selection of supervisor
            if (roleName.toLowerCase().trim() === 'supervisor') {
                this.listnerService.cZentrixSendData({ 'hideBar': true });

            } else {
                this.listnerService.cZentrixSendData({ 'hideBar': false });
            }
            this.getCommonData.current_role = role;
            this.getCommonData.current_service = service;
            this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
            this.getCommonData.cZentrixAgentID =
                (role.agentID ? role.agentID : (this.getCommonData.Userdata.agentID ? this.getCommonData.Userdata.agentID : undefined));
            this.getCommonData.roleSelected.next({
                'id': this.getCommonData.cZentrixAgentID,
                'role': role.RoleName,
                'service': service.serviceName
            });
            // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard'] } }]);
        }
        // if ( role === 'ADMIN' )
        if (roleName === 'ADMIN') {
            this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['superAdmin'] } }]);
        }
    }

}
