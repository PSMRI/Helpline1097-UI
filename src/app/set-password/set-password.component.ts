import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';




@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  newpwd: any;
  confirmpwd: any;
  uname: any = this.getUserData.uname;
  dynamictype: any = 'password';

  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
  currentLanguageSet: any;


  constructor(
    public http_calls: HttpServices,
    public getUserData: dataService,
    private configService: ConfigService,
    public router: Router, private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
  this.assignSelectedLanguage();
   }

assignSelectedLanguage() {
const getLanguageJson = new SetLanguageComponent(this.http_calls);
getLanguageJson.setLanguage();
this.currentLanguageSet = getLanguageJson.currentLanguageObject;
}


  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

  updatePassword(new_pwd) {
    if (new_pwd === this.confirmpwd) {
      this.http_calls.postData(this.configService.getOpenCommonBaseUrl() + 'user/setForgetPassword',
        { 'userName': this.uname, 'password': new_pwd }
      ).subscribe(
        (response: any) => this.successCallback(response),
        (error: any) => this.errorCallback(error)
        );
    } else {
      this.alertService.alert(this.currentLanguageSet.passwordsDoNotMmatch);
    }
  }

  successCallback(response) {

    console.log(response);
    this.alertService.alert(this.currentLanguageSet.passwordChangedSuccessfully);
    this.router.navigate(['']);
  }
  errorCallback(response) {
    console.log(response);
  }


}
