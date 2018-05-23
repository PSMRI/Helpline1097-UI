import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ListnerService } from './../services/common/listner.service';
import { SocketService } from '../services/socketService/socket.service';

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
        private listnerService: ListnerService, public socketService: SocketService
    ) { }

    ngOnInit() {
        this.getCommonData.sendHeaderStatus.next("Role Selection");

        this.privleges = this.getCommonData.userPriveliges;
        // this.privleges[3].roles[1].RoleName = 'Supervisor';

    }

    route2dashboard(role: any, service: any) {
        let roleName = '';
        let serviceName = service.serviceName;
        let screen = role.serviceRoleScreenMappings[0].screen.screenName;
        if (screen.trim().toLowerCase() === 'Registration_Counselling'.trim().toLowerCase()) {
            roleName = 'co';
        } else if (screen.trim().toLowerCase() === 'Supervising'.trim().toLowerCase()) {
            roleName = 'supervisor';
        } else {
            roleName = '';
        }
        let providerServiceMapID = service.providerServiceMapID;
        //code for live notification
        let finalArray = [
            providerServiceMapID + "_" + roleName.toLowerCase(),
            providerServiceMapID + "_" + roleName.toLowerCase() + "_" + role.workingLocationID,
            providerServiceMapID + "_" + role.workingLocationID.toString()
        ]
        console.log(finalArray);
        debugger;
        this.socketService.sendRoomsArray({ userId: this.getCommonData.uid, role: finalArray });

        //code ended



        // if ( service === '1097' && ( role === 'CO' || role === 'Supervisor' ) )
        if (serviceName === '1097' && (roleName.toLowerCase().trim() === 'co' || roleName.toLowerCase().trim() === 'supervisor')) {
            // this is to hide the c-zentrix bar on selection of supervisor
            if (roleName.toLowerCase().trim() === 'supervisor') {
                this.listnerService.cZentrixSendData({ 'hideBar': true });

            } else {
                this.listnerService.cZentrixSendData({ 'hideBar': false });
            }

            this.getCommonData.current_workingLocationID = role.workingLocationID;
            if (screen.trim().toLowerCase() === 'Registration_Counselling'.trim().toLowerCase()) {
                this.getCommonData.current_role = { 'RoleName': 'CO','RoleID':role.RoleID };
            } else if (screen.trim().toLowerCase() === 'Supervising'.trim().toLowerCase()) {
                this.getCommonData.current_role = { 'RoleName': 'Supervisor','RoleID':role.RoleID };
            } else {
                this.getCommonData.current_role = '';
            }
            // this.getCommonData.current_role = role;
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
