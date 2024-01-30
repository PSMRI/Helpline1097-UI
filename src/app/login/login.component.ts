/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component,forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SocketService } from '../services/socketService/socket.service';
import { Subscription } from 'rxjs';
import { InterceptedHttp } from 'app/http.interceptor';
// import { SHA256, enc } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
// import { AES } from 'crypto-js';
// import { SHA256 } from 'crypto-js';





@Component({
  selector: 'login-component',
  templateUrl: './login.html',
  styleUrls: ['./login.component.css']
})

export class loginContentClass implements OnInit, OnDestroy {
  model: any = {};
  userID: any;
  code: any;
  
  encryptedVar: any;
  key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;

 
  loading = false;
  public loginResult: string;
  dynamictype: any = 'password';
  logoutUserFromPreviousSessionSubscription: Subscription;

  previlageObj: any = [];
  encryptPassword: any;

  constructor(public loginservice: loginService, public router: Router, public alertService: ConfirmationDialogsService,
    public dataSettingService: dataService, private czentrixServices: CzentrixServices, private socketService: SocketService,   private httpService: InterceptedHttp) {
      this._keySize = 256;
      this._ivSize = 128;
      this._iterationCount = 1989;
    if (sessionStorage.getItem('authToken')) {
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
    this.httpService.dologoutUsrFromPreSession(false);
    this.logoutUserFromPreviousSessionSubscription =
      this.httpService.logoutUserFromPreviousSessions$.subscribe(
        (logoutUser) => {
          if (logoutUser) {
            this.loginUser(true);
          }
        }
      );
    if (sessionStorage.getItem('authToken')) {
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

  // encrypt(password) {
    
  //   var key = CryptoJS.PBKDF2(password, this.SALT, {
  //     // var key = CryptoJS.PKCS5(password, this.SALT, {
  //     keySize: 256 / 32,
  //     iterations: 65536
  //   })
  //   var encrypted = CryptoJS.AES.encrypt(password, key, {
  //     iv: this.toWordArray(this.Key_IV),
  //     padding: CryptoJS.pad.Pkcs7,
  //     // padding: CryptoJS.pad.Pkcs5,

  //     mode: CryptoJS.mode.CBC
  //   })
  //   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  // }

  // toWordArray(str) {
  //   return CryptoJS.enc.Utf8.parse(str);
  //   }

    // encoder(str) {
    //   let encoder = new TextEncoder();
    //   let byteArray = encoder.encode(str)
    //   return CryptoJS.enc.Utf8.parse(str)
    // }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }



  get iterationCount() {
    return this._iterationCount;
  }



  set iterationCount(value) {
    this._iterationCount = value;
  }



  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
      keySize: this.keySize / 32,
      iterations: this._iterationCount
    })
  }



  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  encrypt(passPhrase, plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
    let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }

  login(doLogOut) {
    this.encryptPassword = this.encrypt(this.Key_IV, this.code)
  //   this.password = CryptoJS.AES.encrypt(this.password,this.encPassword).toString();
  //  console.log("PARTH"+this.password.ciphertext.toString(CryptoJS.enc.Base64))
    // this.password = AES.encrypt(this.password).toString();
    // this.password = CryptoJS.SHA256(this.password).toString();
    // this.encryptedVar=SHA256(this.password).toString(enc.Hex);
    // this.password=this.encryptedVar.substr(0, 16);
    this.loginservice
      .authenticateUser(this.userID, this.encryptPassword, doLogOut)
      .subscribe(
        (response: any) => {
          if (
            response !== undefined &&
            response !== null &&
            response.previlegeObj !== undefined &&
            response.previlegeObj !== null
          ) {
            this.successCallback(response, this.userID, this.code);
          }
        },
        (error: any) => this.errorCallback(error)
      );
  }

  // login(doLogOut) {
  //   this.loginservice
  //     .authenticateUser(this.userID, this.password, doLogOut)
  //     .subscribe(
  //       (response: any) => {
  //         if (
  //           response !== undefined &&
  //           response !== null &&
  //           response.previlegeObj !== undefined &&
  //           response.previlegeObj !== null
  //         ) {
  //           this.successCallback(response, this.userID, this.password);
  //         }
  //       },
  //       (error: any) => this.errorCallback(error)
  //     );
  // }
//ADID- KA40094929 
// added new method to force logout the user
  loginUser(doLogOut) {
    this.loginservice
    .userLogOutFromPreviousSession(this.userID)
    .subscribe(
      (userLogOutRes: any) => {
      if(userLogOutRes && userLogOutRes.data.response) {
    this.loginservice
      .authenticateUser(this.userID, this.encryptPassword, doLogOut)
      .subscribe(
        (response: any) => {
          if (
            response !== undefined &&
            response !== null &&
            response.previlegeObj !== undefined &&
            response.previlegeObj !== null
          ) {
            this.successCallback(response, this.userID, this.code);
          }
        },
        (error: any) => this.errorCallback(error)
      );
      }
      else
      {
            this.alertService.alert(userLogOutRes.errorMessage, 'error');
      }
      });
  }

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
    this.previlageObj.forEach((assignAgentID) => {
      this.dataSettingService.Userdata.agentID = assignAgentID.agentID;
    })
    this.dataSettingService.loginIP = response.loginIPAddress;
    // this.getLoginKey(userID, password);
    // console.log( "array" + response.Previlege );
    console.log('array' + this.previlageObj);

    if (response.isAuthenticated === true && response.Status === 'Active') {
      if (this.dataSettingService.current_serviceID === undefined) {
        alert('ServiceID not found. Some things may not work');
      }
      sessionStorage.removeItem('isOnCall');
      sessionStorage.removeItem('isEverwellCall');
      sessionStorage.setItem('authToken', response.key);
      this.router.navigate(['/MultiRoleScreenComponent'], { skipLocationChange: true });
      // this.socketService.reInstantiate();

    }
    if (response.isAuthenticated === true && response.Status === 'New') {
      sessionStorage.setItem('authToken', response.key);
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
  ngOnDestroy() {
    if (this.logoutUserFromPreviousSessionSubscription) {
      this.logoutUserFromPreviousSessionSubscription.unsubscribe();
    }
  }

}
