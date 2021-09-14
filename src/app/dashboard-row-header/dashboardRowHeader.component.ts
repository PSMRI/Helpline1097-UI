import { Component } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { ConfigService } from "../services/config/config.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "dashboard-row-header",
  templateUrl: "./dashboardRowHeader.html",
})
export class DashboardRowHeaderComponent {
  data: any = this.getCommonData.Userdata;
  currentLanguageSet: any;
  constructor(
    public getCommonData: dataService,
    public _config: ConfigService,
    private httpServices: HttpServices
  ) {}
  ngOninit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  logOut() {
    // Cookie.deleteAll();
    // this.router.navigate(['/MultiRoleScreenComponent/roleSelection']);
    // location.assign(this.loginUrl);
  }
}
