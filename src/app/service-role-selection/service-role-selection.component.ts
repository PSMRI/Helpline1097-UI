import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ListnerService } from './../services/common/listner.service';
import { SocketService } from '../services/socketService/socket.service';
import { CallServices } from 'app/services/callservices/callservice.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
    selector: 'app-service-role-selection',
    templateUrl: './service-role-selection.component.html',
    styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {
    privleges: any;
    currentLanguageSet: any;

    constructor(
        public getCommonData: dataService,
        public router: Router,
        private callService: CallServices,
        private listnerService: ListnerService, public socketService: SocketService,
        public httpServices:HttpServices
    ) { }

    ngOnInit() {
        this.assignSelectedLanguage();  
        this.listnerService.cZentrixSendData({ 'hideBar': true });
        this.getCommonData.sendHeaderStatus.next("Role Selection");

        this.privleges = this.getCommonData.userPriveliges;
        // this.privleges[3].roles[1].RoleName = 'Supervisor';

    }

    ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

    route2dashboard(role: any, service: any) {
        sessionStorage.setItem('apiman_key',service.apimanClientKey);
        let roleName = '';
        let serviceName = service.serviceName;
        let screen = role.serviceRoleScreenMappings[0].screen.screenName;
        this.callService.onceOutbound = false;
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
            this.getCommonData.currentCampaignName = role.serviceRoleScreenMappings[0].providerServiceMapping.ctiCampaignName;
            if (screen.trim().toLowerCase() === 'Registration_Counselling'.trim().toLowerCase()) {
                this.getCommonData.current_role = { 'RoleName': 'CO', 'RoleID': role.RoleID };
            } else if (screen.trim().toLowerCase() === 'Supervising'.trim().toLowerCase()) {
                this.getCommonData.current_role = { 'RoleName': 'Supervisor', 'RoleID': role.RoleID };
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
