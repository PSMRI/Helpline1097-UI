import { Component, OnInit, Renderer } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { dataService } from "../services/dataService/data.service";
import { ConfigService } from "../services/config/config.service";
import { ConfirmationDialogsService } from "../services/dialog/confirmation.service";
import { ListnerService } from "./../services/common/listner.service";
import { CallServices } from "./../services/callservices/callservice.service";
declare var jQuery: any;
import { SocketService } from "../services/socketService/socket.service";
import { ToasterService, ToasterConfig } from "angular2-toaster";
import { Subscription } from "rxjs/Subscription";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "dashboard-component",
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.component.css"],
})
export class dashboardContentClass implements OnInit {
  currentLanguageSet: any;

  barMinimized: boolean = true;
  eventSpiltData: any;
  data: any;
  ctiHandlerURL: any;
  current_service: any;
  current_role: any;
  inOutBound: any;
  showDashboardContent: boolean = false;
  activity_component: boolean = true;
  ratings_component: boolean = true;
  alerts_component: boolean = true;
  news_component: boolean = true;
  call_statistics: boolean = true;
  training_resources: boolean = true;
  widget: any = "0";
  listenCall: any;
  compainType: any;
  alertRefresh: number = 1;
  notificationSubscription: Subscription;
  inboundCall: boolean = false;
  outboundCall: boolean = false;
  agentID: any;
  agentIDExitsFlag: boolean = false;
  public config: ToasterConfig = new ToasterConfig({
    timeout: 15000,
  });
  inOutBoundNow: boolean;

  constructor(
    public dataSettingService: dataService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private message: ConfirmationDialogsService,
    private renderer: Renderer,
    private callService: CallServices,
    private listnerService: ListnerService,
    public socketService: SocketService,
    public HttpServices: HttpServices
  ) {
    // this.notificationSubscription = this.socketService.getMessages().subscribe((data) => {
    //   console.log(data);
    //   this.alertRefresh++;
    //   if (data.type == 'Alert') {
    //     this.toasterService.popAsync('error', data.type, data.subject + ": " + data.message).subscribe((res) => {
    //       console.log(res);
    //     });
    //   }
    //   if (data.type == 'Notification') {
    //     this.toasterService.popAsync('success', data.type, data.subject + ": " + data.message).subscribe((res) => {
    //       console.log(res);
    //     });
    //   }
    //   if (data.type == 'Emergency_Contact') {
    //     this.toasterService.popAsync('warning', data.type, data.subject + " " + data.message).subscribe((res) => {
    //       console.log(res);
    //     });
    //   }
    //   if (data.type == 'Training_Resource') {
    //     this.toasterService.popAsync('wait', data.type, data.subject + ": " + data.message).subscribe((res) => {
    //       console.log(res);
    //     });
    //   }
    //   if (data.type == 'Location_Message') {
    //     this.toasterService.popAsync('info', data.type, data.subject + ": " + data.message).subscribe((res) => {
    //       console.log(res);
    //     });
    //   }
    // })
  }

  ngOnInit() {
    this.assignSelectedLanguage();

    this.dataSettingService.inOutCampaign.subscribe((data) => {
      console.log(data);
      // this.setCampaign()
    });
    this.setCampaign();
    const obj = { innerPage: false };
    this.listnerService.cZentrixSendData(obj);
    this.current_role = this.dataSettingService.current_role.RoleName;

    const url =
      this.configService.getTelephonyServerURL() +
      "bar/cti_handler.php?e=" +
      this.dataSettingService.cZentrixAgentID;
    console.log("url = " + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log("url = " + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showDashboardContent = true;
    this.showDashboard();
    this.agentID = this.dataSettingService.cZentrixAgentID;
    this.agentIDexists(this.agentID);

    jQuery(document).ready(function () {
      jQuery('[data-toggle="tooltip"]').tooltip();
    });
    this.dataSettingService.sendHeaderStatus.next(
      this.current_role + " Dashboard"
    );
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  agentIDexists(agentID) {
    console.log(agentID, "AGENT ID IN DASHBOARD");
    if (agentID != undefined) {
      this.agentIDExitsFlag = true;
    } else {
      this.agentIDExitsFlag = false;
    }
  }
  setCampaign() {
    sessionStorage.removeItem("current_campaign");
    this.current_role = this.dataSettingService.current_role.RoleName;
    let current_roleID = this.dataSettingService.current_role.RoleID;
    this.dataSettingService.inboundOutbound$.subscribe((response) => {
      if (response !== null) {
        for (let value of response.previlegeObj) {
          for (let role of value.roles) {
            role.outbound === true;
            if (
              role.RoleID === current_roleID &&
              role.inbound === true &&
              role.outbound === true
            ) {
              this.dataSettingService.onlyOutboundAvailable = false;
              if (this.dataSettingService.current_campaign === "OUTBOUND") {
                this.dataSettingService.isOutBoundSelected = true;
                this.dataSettingService.outboundSelectedManual = false;
                this.inOutBound = "0";
                this.inboundCall = true;
                this.outboundCall = true;
              } else {
                this.dataSettingService.current_campaign = "INBOUND";
                sessionStorage.setItem("current_campaign", "INBOUND");
                this.dataSettingService.isOutBoundSelected = false;
                this.inOutBound = "1";
                this.inboundCall = true;
                this.outboundCall = true;
              }
            } else if (
              role.RoleID === current_roleID &&
              role.inbound === true
            ) {
              this.dataSettingService.current_campaign = "INBOUND";
              sessionStorage.setItem("current_campaign", "INBOUND");
              this.dataSettingService.isOutBoundSelected = false;
              this.dataSettingService.outboundSelectedManual = false;
              this.dataSettingService.onlyOutboundAvailable = false;
              this.inOutBound = "1";
              this.inboundCall = true;
            } else if (
              role.RoleID === current_roleID &&
              role.outbound === true
            ) {
              this.inOutBound = "0";
              this.outboundCall = true;
              this.dataSettingService.onlyOutboundAvailable = true;
              this.dataSettingService.current_campaign = "OUTBOUND";
              this.callService
                .switchToOutbound(this.dataSettingService.cZentrixAgentID)
                .subscribe(
                  (response) => {
                    sessionStorage.setItem("current_campaign", "OUTBOUND");
                    this.dataSettingService.isOutBoundSelected = true;
                    console.log("outbound");
                  },
                  (err) => {
                    console.log("agent in not logged in");
                    if (
                      err.errorMessage ===
                      "Agent 4201 is already in MANUAL mode"
                    ) {
                      this.dataSettingService.isOutBoundSelected = true;
                    }
                    sessionStorage.setItem("current_campaign", "OUTBOUND");
                  }
                );
              if (
                role.outbound === true &&
                (role.inbound == null || role.inbound === false)
              ) {
                this.callService.onlyOutbound = true;
              }
            } else {
              console.log("Supervisor role");
            }
          }
        }
      }
    });
  }
  showDashboard() {
    this.data = this.dataSettingService.Userdata;
    this.current_service = this.dataSettingService.current_service.serviceName;
    this.current_role = this.dataSettingService.current_role.RoleName;
    let campaign = sessionStorage.getItem("current_campaign");
    // if(campaign != null && campaign != undefined && campaign !== "OUTBOUND"){
    this.addListener();
    this.listenCall = this.renderer.listenGlobal(
      "window",
      "message",
      (event) => {
        this.listener(event);
        // Do something with 'event'
      }
    );
  }
  toggleBar() {
    // if ( this.barMinimized )
    //   this.barMinimized = false;
    // else
    this.barMinimized = !this.barMinimized;
  }
  minimizeBar() {
    this.barMinimized = true;
    // this.testEvent();
  }

  // testing event
  testEvent() {
    // var event = new Event('message');
    let date = new Date().getTime().toString().slice(0, 10);
    let event = new CustomEvent("message", {
      detail: {
        data: "Accept|9845098451|" + date + "." + date + "|INBOUND",
        time: new Date(),
      },
      bubbles: true,
      cancelable: true,
    });
    // document.dispatchEvent(event);
  }

  listener(event) {
    console.log("listener invoked: " + event);
    console.log("event received" + JSON.stringify(event));
    if (event.data !== undefined && event.data !== null) {
      this.eventSpiltData = event.data.split("|");
    } else {
      this.eventSpiltData = event.detail.data.split("|");
    }
    if (
      this.eventSpiltData[2] !== undefined &&
      this.eventSpiltData[2] !== "undefined" &&
      this.eventSpiltData[2] !== null &&
      this.eventSpiltData[2] !== ""
    ) {
      if (!sessionStorage.getItem("session_id")) {
        this.handleEvent();
      } else if (
        sessionStorage.getItem("session_id") !== this.eventSpiltData[2]
      ) {
        // If session id is different from previous session id then allow the call to drop
        this.handleEvent();
      }
      if (this.eventSpiltData[0].toLowerCase() === "accept") {
        this.handleEvent();
      }
    }
  }

  handleEvent() {
    if (this.eventSpiltData.length > 2) {
      sessionStorage.setItem("isOnCall", "yes");
      const mobileNumber = this.eventSpiltData[1].replace(/\D/g, "");
      const checkNumber = /^\d+$/;
      const sessionVar = /^\d{10}\.\d{10}$/;
      const checkCallType = /^(INBOUND)|(OUTBOUND)$/i;

      if (
        checkNumber.test(mobileNumber) &&
        sessionVar.test(this.eventSpiltData[2]) &&
        checkCallType.test(this.eventSpiltData[3])
      ) {
        this.dataSettingService.setUniqueCallIDForInBound = true;
        sessionStorage.setItem("CLI", this.eventSpiltData[1]);
        sessionStorage.setItem("session_id", this.eventSpiltData[2]);
        sessionStorage.setItem("callCategory", this.eventSpiltData[3]);
        this.router.navigate([
          "/MultiRoleScreenComponent/RedirectToInnerpageComponent",
        ]);
      } else {
        this.message.alert(this.currentLanguageSet.invalidCallPleaseCheck);
      }
    }
  }

  addListener() {
    if (window.parent.parent.addEventListener) {
      console.log("adding message listener");
      // document.addEventListener( "message", this.listener.bind( this ), false );

      try {
        addEventListener("message", this.listener.bind(this), false);
      } catch (error) {
        console.log("logging error : ", error);
      }

      console.log("Msg listener is added .");
    } else {
      console.log("adding onmessage listener");
      // document.attachEvent("onmessage", this.listener);
    }
  }

  campaign(value) {
    console.log(value);
    if (value === "1") {
      this.message
        .confirm("", this.currentLanguageSet.switchToInbound)
        .subscribe((response) => {
          if (response) {
            this.callService
              .switchToInbound(this.dataSettingService.cZentrixAgentID)
              .subscribe(
                (res) => {
                  this.dataSettingService.current_campaign = "INBOUND";
                  this.dataSettingService.isOutBoundSelected = false;
                  this.dataSettingService.outboundSelectedManual = false;
                  sessionStorage.setItem("current_campaign", "INBOUND");
                },
                (err) => {
                  this.message.alert(err.errorMessage, "error");
                  this.inOutBound = 0;
                }
              );
          } else {
            this.inOutBound = 0;
          }
        });
    } else if (value === "0") {
      this.message
        .confirm("", this.currentLanguageSet.switchToOutbound)
        .subscribe((response) => {
          if (response) {
            this.callService
              .switchToOutbound(this.dataSettingService.cZentrixAgentID)
              .subscribe(
                (res) => {
                  this.dataSettingService.current_campaign = "OUTBOUND";
                  this.dataSettingService.isOutBoundSelected = true;
                  this.dataSettingService.outboundSelectedManual = true;
                  sessionStorage.setItem("current_campaign", "OUTBOUND");
                },
                (err) => {
                  this.message.alert(err.errorMessage, "error");
                  this.inOutBound = 1;
                }
              );
          } else {
            this.inOutBound = 1;
          }
        });
    }
  }
  addWidget(widget_name) {
    if (widget_name === "1") {
      this.activity_component = true;
    }
    if (widget_name === "2") {
      this.ratings_component = true;
    }
    if (widget_name === "3") {
      this.alerts_component = true;
    }
    // if (widget_name === "4") {
    //   this.daily_tasks_component = true;
    // }
    if (widget_name === "5") {
      this.news_component = true;
    }
    if (widget_name === "6") {
      this.call_statistics = true;
    }
    if (widget_name === "7") {
      this.training_resources = true;
    }
  }
  hideComponentHandeler(event) {
    console.log("event is", event);
    if (event === "1") {
      this.activity_component = false;
    }
    if (event === "2") {
      this.ratings_component = false;
    }
    if (event === "3") {
      this.alerts_component = false;
    }
    // if (event === "4") {
    //   this.daily_tasks_component = false;
    // }
    if (event === "5") {
      this.news_component = false;
    }
    if (event === "6") {
      this.call_statistics = false;
    }
    if (event === "7") {
      this.training_resources = false;
    }
  }

  ngOnDestroy() {
    // this.listenCall();
    // this.notificationSubscription.unsubscribe();
  }
  // CODE FOR SIDE NAV
  clicked: boolean = false;
  hamburgerHoverOut() {
    console.log(this.clicked);
    if (this.clicked === true) {
      const element = document.querySelector(".leftMenu");
      element.classList.toggle("openMenu");

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName("dropdown");
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove("active");
      }
    }
    this.clicked = false;
  }

  hamburgerClick() {
    if (this.clicked === false) {
      this.clicked = true;
      const element = document.querySelector(".leftMenu");
      element.classList.toggle("openMenu");

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName("dropdown");
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove("active");
      }
    }
  }
  routeToRoleSelection() {
    // this.socketService.logOut();
    this.router.navigate(["/MultiRoleScreenComponent"]);
    // this.socketService.reInstantiate();
  }
}
