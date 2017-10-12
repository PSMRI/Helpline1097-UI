import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  newpwd: any;
  confirmpwd: any;

  uname: any = this.getUserData.uname;
  private _commonBaseURL = this.configService.getCommonBaseURL();
  constructor(
    public http_calls: HttpServices,
    public getUserData: dataService,
    public router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {
  }

  updatePassword(new_pwd) {
    if (new_pwd === this.confirmpwd) {
      this.http_calls.postData(this._commonBaseURL + 'user/setForgetPassword',
        { 'userName': this.uname, 'password': new_pwd }
      ).subscribe(
        (response: any) => this.successCallback(response),
        (error: any) => this.errorCallback(error)
        );

      alert('Password is changed for user ' + this.uname);
    } else {
      alert('Password does not match');
    }
  }

  successCallback(response) {
    console.log(response);
    this.router.navigate(['/loginContentClass']);
  }
  errorCallback(response) {
    console.log(response);
  }


}
