import { Component, OnInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';
import { ListnerService } from './../services/common/listner.service';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.html'
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
  constructor(
    public dataSettingService: dataService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private message: ConfirmationDialogsService,
    private _loginService: loginService,
    private renderer: Renderer
  ) { };
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
    // const userObj = JSON.parse(Cookie.get('userID'));
    // if (userObj) {
    //   const roleObj = {};
    //   roleObj['RoleName'] = userObj.RoleName;


    //   this.dataSettingService.current_role = roleObj;
    //   this.dataSettingService.current_service = userObj.serviceObj;
    //   this.current_role = this.dataSettingService.current_role.RoleName;
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
   //  document.dispatchEvent(event);

  }

  listener(event) {
    console.log('listener invoked: ' + event);
    console.log('event received' + JSON.stringify(event));
    // spliting test event
    // this.eventSpiltData = event.detail.data.split( '|' );
    // spliting czntrix event
    if (event.data) {
      this.eventSpiltData = event.data.split('|');
    } else {
      this.eventSpiltData = event.detail.data.split('|');
    }
    this.handleEvent();

  }

  handleEvent() {
    this.router.navigate(['/InnerpageComponent', this.eventSpiltData[1], this.eventSpiltData[2]]);
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
          this.dataSettingService.current_campaign = 'INBOUND';
        } else {
          this.inOutBound = 0;
        }
      })

    }
    if (value === '0') {
      this.message.confirm('', 'Switch to Outbound?').subscribe((response) => {
        if (response) {
          this.dataSettingService.current_campaign = 'OUTBOUND';
        } else {
          this.inOutBound = 1;
        }
      })
    }
  }
  // ngOnDestroy() {
  //   Cookie.deleteAll();
  // }
  addWidget(widget_name) {
    if (widget_name === '1') {
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
    console.log('event is', event);
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
    this.listenCall();
  }
}

