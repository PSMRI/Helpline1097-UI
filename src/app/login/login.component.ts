import { Component, OnInit } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SocketService } from '../services/socketService/socket.service';


@Component({
  selector: 'login-component',
  templateUrl: './login.html',
  styleUrls: ['./login.component.css']
})

export class loginContentClass implements OnInit {
  model: any = {};
  userID: any;
  password: any;
  loading = false;
  public loginResult: string;
  dynamictype: any = 'password';

  previlageObj: any = [];

  constructor(public loginservice: loginService, public router: Router, public alertService: ConfirmationDialogsService,
    public dataSettingService: dataService, private czentrixServices: CzentrixServices, private socketService: SocketService) {
    if (localStorage.getItem('authToken')) {
      this.loginservice.checkAuthorisedUser().subscribe((response) => {
        if(response !== null && response !== undefined)  {
        this.dataSettingService.Userdata = response;
        // this.dataSettingService.userPriveliges = response.Previlege;
        if(response.previlegeObj !== undefined && response.previlegeObj !== null) {
        this.previlageObj = response.previlegeObj.filter((previlage) => { return previlage.serviceName == "1097" });
        }
        // if (this.previlageObj.length > 0) {
        this.dataSettingService.userPriveliges = this.previlageObj;
        this.dataSettingService.uid = response.userID;
        this.dataSettingService.uname = response.userName;
        this.dataSettingService.Userdata.agentID = response.agentID;
        this.dataSettingService.loginIP = response.loginIPAddress;
        console.log('array' + this.previlageObj);
        if (response.isAuthenticated === true && response.Status === 'Active') {
          sessionStorage.removeItem('isOnCall');
          sessionStorage.removeItem('isEverwellCall');
          this.router.navigate(['/MultiRoleScreenComponent'], { skipLocationChange: true });
        }
        // } else {
        //   this.loginResult = 'You do not have previlage to login to application';
        // }
        // if (response.isAuthenticated === true && response.Status === 'New') {
        //   this.router.navigate(['/setQuestions']);
        // }
      }}, (err) => {
        //  this.alertService.alert(err.errorMessage, 'error');
      });
    }

  };

  ngOnInit() {


    if (localStorage.getItem('authToken')) {
      this.loginservice.checkAuthorisedUser().subscribe((response) => {
        if(response !== undefined && response !== null) {
          if(response.previlegeObj !== undefined && response.previlegeObj !== null) {
          this.previlageObj = response.previlegeObj.filter((previlage) => { return previlage.serviceName == "1097" });
        }
        // if (this.previlageObj.length > 0) {
        this.dataSettingService.Userdata = response;
        // this.dataSettingService.userPriveliges = response.Previlege;
        this.dataSettingService.userPriveliges = this.previlageObj;
        this.dataSettingService.uid = response.userID;
        this.dataSettingService.uname = response.userName;
        this.dataSettingService.Userdata.agentID = response.agentID;
        this.dataSettingService.loginIP = response.loginIPAddress;
        console.log('array' + this.previlageObj);
        if (response.isAuthenticated === true && response.Status === 'Active') {
          sessionStorage.removeItem('isOnCall');
          sessionStorage.removeItem('isEverwellCall');
          this.router.navigate(['/MultiRoleScreenComponent'], { skipLocationChange: true });
        }
        // } else {
        //   this.loginResult = 'You do not have previlage to login to application';
        // }
        // if (response.isAuthenticated === true && response.Status === 'New') {
        //   this.router.navigate(['/setQuestions']);
        // }
      }
      }, (err) => {
        //  this.alertService.alert(err.errorMessage, 'error');
      });
    }

  }
  login(userId: any, password: any) {
    // this.loading = true;
    console.log(userId, password);
    this.loginResult = undefined;
    this.loginservice.authenticateUser(userId, password).subscribe(
      (response: any) => this.successCallback(response, userId, password),
      (error: any) => this.errorCallback(error));
  };

  successCallback(response: any, userID: any, password: any) {
    this.dataSettingService.current_campaign=undefined;
    this.loading = false;
    console.log(response);
    if (response !== undefined && response !== null) {
      if(response.previlegeObj !== undefined && response.previlegeObj !== null) {
        this.previlageObj = response.previlegeObj.filter((previlage) => { return previlage.serviceName == "1097" });
      }
    // if (this.previlageObj.length > 0) {
    this.dataSettingService.Userdata = response;
    // this.dataSettingService.userPriveliges = response.Previlege;
    this.dataSettingService.userPriveliges = this.previlageObj;
    this.dataSettingService.uid = response.userID;
    this.dataSettingService.current_serviceID = response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID ? 
    response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID : null;
    console.log("current_serviceID:" + this.dataSettingService.current_serviceID );
    this.dataSettingService.uname = response.userName;
    this.dataSettingService.Userdata.agentID = response.agentID;
    this.dataSettingService.loginIP = response.loginIPAddress;
    this.getLoginKey(userID, password);
    // console.log( "array" + response.Previlege );
    console.log('array' + this.previlageObj);

    if (response.isAuthenticated === true && response.Status === 'Active') {
      if (this.dataSettingService.current_serviceID === undefined) {
        alert('ServiceID not found. Some things may not work');
      }
      sessionStorage.removeItem('isOnCall');
      sessionStorage.removeItem('isEverwellCall');
      localStorage.setItem('authToken', response.key);
      this.router.navigate(['/MultiRoleScreenComponent'], { skipLocationChange: true });
      // this.socketService.reInstantiate();

    }
    if (response.isAuthenticated === true && response.Status === 'New') {
      localStorage.setItem('authToken', response.key);
      sessionStorage.removeItem('isOnCall');
      sessionStorage.removeItem('isEverwellCall');
      this.router.navigate(['/setQuestions']);
    }
    // } else {
    //   this.loginResult = 'You do not have previlage to login to application';
    // }
    this.dataSettingService.setInboundOutboundValue(response);
  }
  };
  errorCallback(error: any) {
    if (error.status) {
      this.loginResult = error.errorMessage;
    } else {
      this.loginResult = 'Server seems to busy please try after some time';
    }
    // this.loading = false;
    console.log(error);
  };
  getLoginKey(userId, password) {
    this.czentrixServices.getLoginKey(userId, password).subscribe((response) => {
      console.log('getLoginKey response: ' + JSON.stringify(response));
      this.dataSettingService.loginKey = response.response.login_key;
      console.log('Login key:' + this.dataSettingService.loginKey);
    }, (err) => {
      this.alertService.alert(err.errorMessage, 'error');
      console.log('Error in getLoginKey', err);
    })


  }
  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

}
