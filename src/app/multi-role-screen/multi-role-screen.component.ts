import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';
import { ConfigService } from '../services/config/config.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { PlatformLocation } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ListnerService } from './../services/common/listner.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-multi-role-screen',
  templateUrl: './multi-role-screen.component.html',
  styleUrls: ['./multi-role-screen.component.css']
})
export class MultiRoleScreenComponent implements OnInit {
  data: any;
  current_service: any;
  current_role: any;
  id: any;
  userName: any = '';
  ctiHandlerURL: any;
  loginUrl = this._config.getCommonLoginUrl();
  barMinimized: boolean = true;
  checkRole = true;
  hideBar: boolean = false;
  subscription: Subscription;
  hideHeader: boolean = true;
  constructor(public dataSettingService: dataService, private _config: ConfigService, location: PlatformLocation,
    public router: Router, private _loginService: loginService, private Czentrix: CzentrixServices,
    private alertMessage: ConfirmationDialogsService, private sanitizer: DomSanitizer, private listnerService: ListnerService) {
    location.onPopState((e: any) => {
      console.log(e);
      window.history.forward();

    })
    this.subscription = this.listnerService.cZentrixGetData().subscribe(flag => { this.hideCZentix(flag) }, (err) => {
      this.alertMessage.alert('Error in passing Data');
    });
  }
  ngOnInit() {
    this.data = this.dataSettingService.Userdata;
    this.current_role = (this.dataSettingService.current_role) ? this.dataSettingService.current_role.RoleName : '';
    this.current_service = (this.dataSettingService.current_service) ? this.dataSettingService.current_service.serviceName : '';
    this.id = this.dataSettingService.cZentrixAgentID ?
      this.dataSettingService.cZentrixAgentID : (this.dataSettingService.Userdata.agentID ?
        this.dataSettingService.Userdata.agentID : undefined);
    this.dataSettingService.roleSelected.subscribe((obj) => {
      this.id = obj['id'];
      this.current_role = obj['role'];
      this.current_service = obj['service'];
    })
    this.hideHeader = true;
    const url = this._config.getTelephonyServerURL() + 'bar/cti_handler.php';
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log('url = ' + url);
    this.userName = this.dataSettingService.Userdata.userName;
    // this.router.navigate(['/MultiRoleScreenComponent/roleSelection']);
    // const userObj = JSON.parse(Cookie.get('userID'));
    // if (userObj) {
    //   this._loginService.getUserDetailsByID(userObj.userID).subscribe((response) => {
    //     if (response.isAuthenticated === true && response.Status === 'Active') {

    //       this.userName = response.userName;
    //       this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
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
  // logOut() {
  //   this.router.navigate([''])
  //   // Cookie.deleteAll();
  //   // location.assign(this.loginUrl);
  // }
  logOut() {

    if (this.dataSettingService.loginIP === undefined || this.dataSettingService.loginIP === '') {
      this.Czentrix.getIpAddress(this.dataSettingService.cZentrixAgentID).subscribe((res) => {
        if (res) {
          this.ipSuccessLogoutHandler(res.response.agent_ip);
        }
      });
    } else {
      this.ipSuccessLogoutHandler(this.dataSettingService.loginIP);
    }

  }
  minimizeBar() {
    this.barMinimized = true;
  }
  toggleBar() {
    this.barMinimized = !this.barMinimized;

  }
  ipSuccessLogoutHandler(response) {
    this.Czentrix.agentLogout(this.dataSettingService.cZentrixAgentID, response).subscribe((res) => {

      if (res.response.status.toUpperCase() !== 'FAIL') {
        sessionStorage.removeItem('isOnCall');
        this.router.navigate(['']);
      } else {
        sessionStorage.removeItem('isOnCall');
        this.router.navigate(['']);
        // this.alertMessage.alert('Czentrix Agent Not Logged In');
      }
    }, (err) => {
    });
  }
  hideCZentix(flag: any) {
    if (flag.eventCzentrix.hideBar === true) {
      this.hideBar = false;
    } else if (flag.eventCzentrix.innerPage === true) {
      this.hideHeader = false;
    } else if (flag.eventCzentrix.innerPage === false) {
      this.hideHeader = true;
    } else if (flag.eventCzentrix.hideBar === false) {
      this.hideBar = true;
    }
  }

}
