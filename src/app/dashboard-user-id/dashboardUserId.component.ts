import { Component, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { CzentrixServices } from "./../services/czentrix/czentrix.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { CallServices } from "app/services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "dashboard-user-id",
  templateUrl: "./dashboardUserId.html",
})
export class DashboardUserIdComponent implements OnInit {
  current_service: any;
  current_role: any;
  status: any;
  timerSubscription: Subscription;
  assignSelectedLanguageValue: any;
  constructor(
    public dataSettingService: dataService,
    public router: Router,
    private callService: CallServices,
    private Czentrix: CzentrixServices,
    private message: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {
    this.current_service = this.dataSettingService.current_service.serviceName;
    this.current_role = this.dataSettingService.current_role.RoleName;
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getAgentStatus();
    if (this.callService.onlyOutbound && !this.callService.onceOutbound) {
      const timer = Observable.interval(5 * 1000);
      this.timerSubscription = timer.subscribe(() => {
        this.getAgentStatus();
      });
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  getAgentStatus() {
    this.Czentrix.getAgentStatus().subscribe(
      (res) => {
        if (res !== undefined && res !== null && res.data.stateObj.stateName) {
          console.log("in agent state", res);

          if (
            !this.dataSettingService.current_campaign &&
            sessionStorage.getItem("current_campaign")
          ) {
            this.dataSettingService.current_campaign =
              sessionStorage.getItem("current_campaign");
          }
          if (res.data.dialer_type) {
            if (res.data.dialer_type.toUpperCase() == "PROGRESSIVE") {
              this.dataSettingService.inOutCampaign.next("1");
            } else if (res.data.dialer_type.toUpperCase() == "PREVIEW") {
              this.dataSettingService.inOutCampaign.next("0");
            }
          }
          this.status = res.data.stateObj.stateName;

          console.log(
            "isoutboundValue",
            this.dataSettingService.isOutBoundSelected
          );
          console.log(
            "outbpoundseletedmanual",
            this.dataSettingService.outboundSelectedManual
          );
          console.log(
            "outbpoundseletedmanual",
            this.dataSettingService.onlyOutboundAvailable
          );

          // switchtooutbound
          if (
            this.status !== undefined &&
            this.status.toUpperCase() === "FREE" &&
            this.dataSettingService.onlyOutboundAvailable
          ) {
            if (this.dataSettingService.isOutBoundSelected) {
              this.timerSubscription.unsubscribe();
            } else {
              this.callService
                .switchToOutbound(this.dataSettingService.cZentrixAgentID)
                .subscribe(
                  (response) => {
                    sessionStorage.setItem("current_campaign", "OUTBOUND");
                    this.callService.onceOutbound = true;
                    this.callService.onlyOutbound = false;
                    this.timerSubscription.unsubscribe();
                    console.log("outbound");
                  },
                  (err) => {
                    console.log("agent in not logged in");
                    sessionStorage.setItem("current_campaign", "OUTBOUND");
                  }
                );
            }
          }
          if (
            this.status != undefined &&
            this.status.toUpperCase() === "FREE" &&
            !this.dataSettingService.onlyOutboundAvailable &&
            this.timerSubscription !== undefined
          ) {
            this.timerSubscription.unsubscribe();
          }

          if (
            this.status.toUpperCase() === "INCALL" ||
            this.status.toUpperCase() === "CLOSURE"
          ) {
            if (!sessionStorage.getItem("session_id")) {
              this.routeToInnerPage(res);
            } else if (
              sessionStorage.getItem("session_id") !== res.session_id
            ) {
              // If session id is different from previous session id then allow the call to drop
              this.routeToInnerPage(res);
            }
          }
          if (res.data.stateObj.stateType) {
            this.status += " (" + res.data.stateObj.stateType + ")";
          }
        }
      },
      (err) => {
        this.dataSettingService.inOutCampaign.next("1");

        console.log("CZ AGENT NOT LOGGED IN");
      }
    );
  }
  routeToInnerPage(res) {
    const CLI = res.data.cust_ph_no;
    const session_id = res.data.session_id;
    if (
      session_id !== undefined &&
      session_id !== null &&
      session_id !== "undefined" &&
      session_id !== ""
    ) {
      sessionStorage.setItem("isOnCall", "yes");
      sessionStorage.setItem("CLI", CLI);
      sessionStorage.setItem("session_id", session_id);
      this.dataSettingService.setUniqueCallIDForInBound = true;
      this.router.navigate([
        "/MultiRoleScreenComponent/RedirectToInnerpageComponent",
      ]);
    } else {
      console.log("session id is null");
    }
  }
  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }
}
