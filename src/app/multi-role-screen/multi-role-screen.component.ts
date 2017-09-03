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
    const userID = Cookie.get('userID');
    if (userID) {
      this._loginService.getUserDetailsByID(userID).subscribe((response) => {
        if (response.isAuthenticated === true && response.Status === 'Active') {
          this.dataSettingService.Userdata = response;
          // this.dataSettingService.userPriveliges = response.Previlege;
          this.dataSettingService.userPriveliges = response.previlegeObj;
          this.dataSettingService.uid = response.userID;
          this.dataSettingService.uname = response.userName;
          this.userName = response.userName;
          this.router.navigate(['/MultiRoleScreenComponent/roleSelection']);
        } else {
          location.assign(this.loginUrl);
          Cookie.deleteAll();

        }
      }, (err) => {
      })
    } else {
      location.assign(this.loginUrl);
      Cookie.deleteAll();
    }
  }
  ngOnDestroy() {
    Cookie.deleteAll();
  }

}
