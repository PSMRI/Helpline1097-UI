import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';
import { ConfigService } from '../services/config/config.service';

@Component({
  selector: 'app-multi-role-screen',
  templateUrl: './multi-role-screen.component.html',
  styleUrls: ['./multi-role-screen.component.css']
})
export class MultiRoleScreenComponent implements OnInit {
  userName: any = '';
  loginUrl = this._config.getCommonLoginUrl();
  constructor(public dataSettingService: dataService, private _config: ConfigService,
    public router: Router, private _loginService: loginService) {
  }
  ngOnInit() {
    debugger;
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
  logOut() {
    this.router.navigate([''])
    // Cookie.deleteAll();
    // location.assign(this.loginUrl);
  }

}
