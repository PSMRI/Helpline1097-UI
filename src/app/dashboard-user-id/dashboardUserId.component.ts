import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CallServices } from 'app/services/callservices/callservice.service';

@Component({
    selector: 'dashboard-user-id',
    templateUrl: './dashboardUserId.html',
})
export class DashboardUserIdComponent implements OnInit {
    current_service: any;
    current_role: any;
    status: any;
    timerSubscription: Subscription;
    constructor(
        public dataSettingService: dataService,
        public router: Router,
        private callService: CallServices,
        private Czentrix: CzentrixServices,
        private message: ConfirmationDialogsService
    ) {
        this.current_service = this.dataSettingService.current_service.serviceName;
        this.current_role = this.dataSettingService.current_role.RoleName;

    };
    ngOnInit() {
        this.getAgentStatus()
        if(this.callService.onlyOutbound && !this.callService.onceOutbound){
            const timer = Observable.interval(5 * 1000);
            this.timerSubscription = timer.subscribe(() => {
                this.getAgentStatus();
            });
        }
        
    }
    getAgentStatus() {
        this.Czentrix.getAgentStatus().subscribe((res) => {
            if (res && res.data.stateObj.stateName) {
                console.log("in agent state", res);
                
                if (!this.dataSettingService.current_campaign && sessionStorage.getItem("current_campaign")) {
                    this.dataSettingService.current_campaign = sessionStorage.getItem("current_campaign");
                }
                if (res.data.dialer_type) {
                    if (res.data.dialer_type.toUpperCase() == "PROGRESSIVE") {
                        this.dataSettingService.inOutCampaign.next("1");
                    }
                    else if (res.data.dialer_type.toUpperCase() == "PREVIEW") {
                        this.dataSettingService.inOutCampaign.next("0");
                    }
                }
                this.status = res.data.stateObj.stateName;

                // switchtooutbound
                if( this.status != undefined && this.status.toUpperCase() === "FREE" ){
                    this.callService.switchToOutbound(this.dataSettingService.cZentrixAgentID).subscribe((response)=>{
                        sessionStorage.setItem("current_campaign", 'OUTBOUND');
                        this.callService.onceOutbound = true;
                        this.callService.onlyOutbound = false;
                        this.timerSubscription.unsubscribe();
                        console.log("outbound");
                      }, (err) => {
                        console.log("agent in not logged in");                        
                        sessionStorage.setItem("current_campaign", 'OUTBOUND');
                      })
                }

                if (this.status.toUpperCase() === 'INCALL' || this.status.toUpperCase() === 'CLOSURE') {
                    if (!sessionStorage.getItem('session_id')) {
                        this.routeToInnerPage(res);
                    } else if (sessionStorage.getItem('session_id') !== res.session_id) {  // If session id is different from previous session id then allow the call to drop
                        this.routeToInnerPage(res);
                    }
                   
                }
                if (res.data.stateObj.stateType) {
                    this.status += ' (' + res.data.stateObj.stateType + ')';
                }
            }
        }, (err) => {
            // this.message.alert(err.errorMessage,'error');
            this.dataSettingService.inOutCampaign.next("1");

            console.log("CZ AGENT NOT LOGGED IN")
        })
    }
    routeToInnerPage(res)
    {
        let CLI = res.data.cust_ph_no;
        let session_id = res.data.session_id;
        sessionStorage.setItem('isOnCall', 'yes');
        sessionStorage.setItem('CLI', CLI);
        sessionStorage.setItem('session_id', session_id);
        this.dataSettingService.setUniqueCallIDForInBound = true;
        this.router.navigate(['/MultiRoleScreenComponent/RedirectToInnerpageComponent']);
    }
    ngOnDestroy(){

        if(this.timerSubscription)
            this.timerSubscription.unsubscribe();
    }
}