import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-supervisor-campaign-status',
  templateUrl: './supervisor-campaign-status.component.html',
  styleUrls: ['./supervisor-campaign-status.component.css']
})
export class SupervisorCampaignStatusComponent implements OnInit {
  campaignStatusUrl: any;
  currentLanguageSet: any;
  constructor(private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private saved_data: dataService,
    public httpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    let url = this.configService.getTelephonyServerURL() + "adminui.php?campaignStatus";
    console.log("url = " + url);
    this.campaignStatusUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
    }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
