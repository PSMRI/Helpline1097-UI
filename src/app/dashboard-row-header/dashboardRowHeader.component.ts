import { Component } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'dashboard-row-header',
  templateUrl: './dashboardRowHeader.html',
})
export class DashboardRowHeaderComponent {
  loginUrl = this._config.getCommonLoginUrl();
  data: any = this.getCommonData.Userdata;
  constructor(public getCommonData: dataService, public _config: ConfigService) {

  }

  logOut() {
    Cookie.deleteAll();
    location.assign(this.loginUrl);
  }
}
