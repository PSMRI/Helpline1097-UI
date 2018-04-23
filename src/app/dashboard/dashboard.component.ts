import { Component, OnInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';
import { ListnerService } from './../services/common/listner.service';
import { CallServices } from './../services/callservices/callservice.service';
declare var jQuery: any;
import { SocketService } from '../services/socketService/socket.service';
//import {ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.html',
  styleUrls : ['./dashboard.component.css']
})

export class dashboardContentClass implements OnInit {
  barMinimized: boolean = true;
  eventSpiltData: any;
  data: any;
  ctiHandlerURL: any;
  current_service: any;
  current_role: any;
  inOutBound: any = '1';
  showDashboardContent: boolean = false;
  activity_component: boolean = true;
  ratings_component: boolean = true;
  alerts_component: boolean = true;
  // daily_tasks_component: boolean = true;
  news_component: boolean = true;
  call_statistics: boolean = true;
  training_resources: boolean = true;
  widget: any = '0';
  listenCall: any;
  loginUrl = this.configService.getCommonLoginUrl();
  compainType: any;
  alertRefresh: number = 1;

  agentID: any;
  agentIDExitsFlag: boolean = false;
  constructor(
    public dataSettingService: dataService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private message: ConfirmationDialogsService,
    private _loginService: loginService,
    private renderer: Renderer,
    private callService: CallServices,
    //private toasterService: ToasterService,
    private listnerService: ListnerService, public socketService: SocketService
  ) { 

    this.socketService.getMessages().subscribe((data)=>{
      console.log(data);
      this.alertRefresh++;
      if(data.type=='Alert'){
        // this.toasterService.popAsync('error',data.type, data.subject+": "+data.message).subscribe((res)=>{
        //   console.log(res);
        // });
      }

      if(data.type=='Notification'){
        // this.toasterService.popAsync('success',data.type, data.subject+": "+data.message).subscribe((res)=>{
        //   console.log(res);
        // });
      }

      if(data.type=='Emergency_Contact'){
        // this.toasterService.popAsync('warning',data.type, data.subject+" "+data.message).subscribe((res)=>{
        //   console.log(res);
        // });
      }

      if(data.type=='Training_Resource'){
        // this.toasterService.popAsync('wait',data.type, data.subject+": "+data.message).subscribe((res)=>{
        //   console.log(res);
        // });
      }

      if(data.type=='Location_Message'){
        // this.toasterService.popAsync('info',data.type, data.subject+": "+data.message).subscribe((res)=>{
        //   console.log(res);
        // });
      }
  })

  };

  ngOnInit() {
    this.activeRoute
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        if (params['compain']) {
          this.compainType = params['compain'];
        } else {
          this.compainType = 'INBOUND';
        }
        this.setCompain(this.compainType);
      });
    const obj = { 'innerPage': false };
    this.listnerService.cZentrixSendData(obj);
    this.callService.switchToInbound(this.dataSettingService.cZentrixAgentID).subscribe((res) => {
    }, (err) => {
    //  this.message.alert(err.errorMessage);
    })
    // const userObj = JSON.parse(Cookie.get('userID'));
    // if (userObj) {
    //   const roleObj = {};
    //   roleObj['RoleName'] = userObj.RoleName;


    //   this.dataSettingService.current_role = roleObj;
    //   this.dataSettingService.current_service = userObj.serviceObj;
       this.current_role = this.dataSettingService.current_role.RoleName;
    //   this._loginService.getUserDetailsByID(userObj.userID).subscribe((response) => {
    //     if (response.isAuthenticated === true && response.Status === 'Active') {
    //       this.dataSettingService.Userdata = response;
    //       // this.dataSettingService.userPriveliges = response.Previlege;
    //       this.dataSettingService.userPriveliges = response.previlegeObj;
    //       this.dataSettingService.uid = response.userID;
    //       this.dataSettingService.uname = response.userName;
    const url = this.configService.getTelephonyServerURL() + 'bar/cti_handler.php';
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showDashboardContent = true;
    this.showDashboard();
    //     } else {
    //       location.assign(this.loginUrl);
    //       Cookie.deleteAll();
    //     }
    //   }, (err) => {
    //   })
    // } else {
    //   location.assign(this.loginUrl);
    //   Cookie.deleteAll();
    // }
    this.agentID = this.dataSettingService.cZentrixAgentID;
    this.agentIDexists(this.agentID);

    jQuery(document).ready(function(){
      jQuery('[data-toggle="tooltip"]').tooltip(); 
  }); 
  }

  agentIDexists(agentID) {
    console.log(agentID, "AGENT ID IN DASHBOARD");
    if (agentID != undefined) {
      this.agentIDExitsFlag = true;
    }
    else {
      this.agentIDExitsFlag = false;
    }

  }

  showDashboard() {
    this.data = this.dataSettingService.Userdata;
    this.current_service = this.dataSettingService.current_service.serviceName;
    this.current_role = this.dataSettingService.current_role.RoleName;
    // this.addListener();
    this.listenCall = this.renderer.listenGlobal('window', 'message', (event) => {
      this.listener(event);
      // Do something with 'event'
    });
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
    let event = new CustomEvent('message', {
      detail: {
        data: 'Accept|9845098451|1489742008.5180000000|INBOUND',
        time: new Date(),
      },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);

  }

  listener(event) {
    console.log('listener invoked: ' + event);
    console.log('event received' + JSON.stringify(event));
    // spliting test event
    // this.eventSpiltData = event.detail.data.split( '|' );
    // spliting czntrix event
    // if (event.origin === 'http://10.201.13.17') {
      if (event.data) {
        this.eventSpiltData = event.data.split('|');
      } else {
        this.eventSpiltData = event.detail.data.split('|');
      }
      if (this.eventSpiltData[0].toLowerCase() === 'accept') {
        this.handleEvent(this.eventSpiltData);
      }
    //}

  }

  handleEvent(eventData) {
    // console.log("received event " + eventData);
    // if (eventData[0] === 'Disconnect') {

    // } else if (eventData[0] === 'AgentXfer' || eventData[0] === 'CampaignXfer') {
    //   alert('call transfer event');
    // } else if ((eventData[0] === 'CallDisconnect' || eventData[0] === 'CustDisconnect')) {
    //   this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
    // } else if (eventData.length > 3 && eventData[3] === 'OUTBOUND') {
    // }
    if (this.eventSpiltData.length > 2) {
      sessionStorage.setItem('isOnCall', 'yes');
      const mobileNumber = this.eventSpiltData[1].replace(/\D/g, '');
      const checkNumber = /^\d+$/;
      const sessionVar = /^\d{10}\.\d{10}$/;
      const checkCallType = /^(INBOUND)|(OUTBOUND)$/i;

      if (checkNumber.test(mobileNumber) && sessionVar.test(this.eventSpiltData[2]) && checkCallType.test(this.eventSpiltData[3])) {
        this.router.navigate(['/MultiRoleScreenComponent/InnerpageComponent',
          this.eventSpiltData[1], this.eventSpiltData[2], this.eventSpiltData[3]]);
      } else {
        this.message.alert('Invalid call please check');
      }
    }
  }

  addListener() {
    if (window.parent.parent.addEventListener) {
      console.log('adding message listener');
      // document.addEventListener( "message", this.listener.bind( this ), false );
      addEventListener('message', this.listener.bind(this), false);
    } else {
      console.log('adding onmessage listener');
      // document.attachEvent("onmessage", this.listener);
    }
  }
  setCompain(compain: any) {
    if (compain.toUpperCase() === 'OUTBOUND') {
      this.inOutBound = 0;
      this.router.navigate(['/InnerpageComponent']);
    } else {
      this.inOutBound = 1;
      this.dataSettingService.current_campaign = 'INBOUND';
    }
  }
  campaign(value) {
    console.log(value);
    if (value === '1') {
      this.message.confirm('', 'Switch to Inbound?').subscribe((response) => {
        if (response) {
          this.callService.switchToInbound(this.dataSettingService.cZentrixAgentID).subscribe((res) => {
            this.dataSettingService.current_campaign = 'INBOUND';
          }, (err) => {
            this.message.alert(err.errorMessage,'error');
            this.inOutBound = 0;
          })
        } else {
          this.inOutBound = 0;
        }
      })

    }
    if (value === '0') {
      this.message.confirm('', 'Switch to Outbound?').subscribe((response) => {
        if (response) {
          this.callService.switchToOutbound(this.dataSettingService.cZentrixAgentID).subscribe((res) => {
            this.dataSettingService.current_campaign = 'OUTBOUND';
          }, (err) => {
            this.message.alert(err.errorMessage,'error');
            this.inOutBound = 1;
          })
        } else {
          this.inOutBound = 1;
        }
      })
    }
  }
  addWidget(widget_name) {
    if (widget_name === '1') {
      this.activity_component = true;
    }
    if (widget_name === '2') {
      this.ratings_component = true;
    }
    if (widget_name === '3') {
      this.alerts_component = true;
    }
    // if (widget_name === "4") {
    //   this.daily_tasks_component = true;
    // }
    if (widget_name === '5') {
      this.news_component = true;
    }
    if (widget_name === '6') {
      this.call_statistics = true;
    }
    if (widget_name === '7') {
      this.training_resources = true;
    }
  }
  hideComponentHandeler(event) {
    console.log('event is', event);
    if (event === '1') {
      this.activity_component = false;
    }
    if (event === '2') {
      this.ratings_component = false;
    }
    if (event === '3') {
      this.alerts_component = false;
    }
    // if (event === "4") {
    //   this.daily_tasks_component = false;
    // }
    if (event === '5') {
      this.news_component = false;
    }
    if (event === '6') {
      this.call_statistics = false;
    }
    if (event === '7') {
      this.training_resources = false;
    }
  }

  ngOnDestroy() {
    this.listenCall();
  }
    // CODE FOR SIDE NAV
    clicked: boolean = false;
    hamburgerHoverOut() {
      console.log(this.clicked);
      if (this.clicked === true) {
        const element = document.querySelector('.leftMenu');
        element.classList.toggle('openMenu');
  
        // const hamburger = document.querySelector('.hamburger');
        // hamburger.classList.toggle('open');
  
        const closeAccordion = document.getElementsByClassName('dropdown');
        let i = 0;
        for (i = 0; i < closeAccordion.length; i++) {
          closeAccordion[i].classList.remove('active');
        }
  
      }
      this.clicked = false;
    }
  
    hamburgerClick() {
      if (this.clicked === false) {
        this.clicked = true;
        const element = document.querySelector('.leftMenu');
        element.classList.toggle('openMenu');
  
        // const hamburger = document.querySelector('.hamburger');
        // hamburger.classList.toggle('open');
  
        const closeAccordion = document.getElementsByClassName('dropdown');
        let i = 0;
        for (i = 0; i < closeAccordion.length; i++) {
          closeAccordion[i].classList.remove('active');
        }
      }
  
    }
    routeToRoleSelection(){
     this.socketService.logOut();
      this.router.navigate(['/MultiRoleScreenComponent']);
     this.socketService.reInstantiate();
    }
}

