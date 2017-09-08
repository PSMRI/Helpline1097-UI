import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';

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
  loginUrl = this.configService.getCommonLoginUrl();
  constructor(
    public dataSettingService: dataService,
    public router: Router,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private message: ConfirmationDialogsService,
    private _loginService: loginService
  ) { };
  ngOnInit() {
    // const userObj = JSON.parse(Cookie.get('userID'));
    // if (userObj) {
    //   const roleObj = {};
    //   roleObj['RoleName'] = userObj.RoleName;
    this.dataSettingService.current_campaign = 'INBOUND';
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
    this.addListener();
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
    // spliting test event
    // this.eventSpiltData = event.detail.data.split( '|' );
    // spliting czntrix event
    if (event.detail.data) {
      this.eventSpiltData = event.detail.data.split('|');
    } else {
      this.eventSpiltData = event.data.split('|');
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
      // document.attachEvent("onmessage", this.listener) 
    }
  }

  campaign(value) {
    console.log(value);
    if (value === '1') {
      this.message.confirm('', 'Are you Sure want to change to Inbound?').subscribe((response) => {
        if (response) {
          this.dataSettingService.current_campaign = 'INBOUND';
        } else {
          this.inOutBound = 0;
        }
      })

    }
    if (value === '0') {
      this.message.confirm('', 'Are you Sure want to change to Outbound?').subscribe((response) => {
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

}

