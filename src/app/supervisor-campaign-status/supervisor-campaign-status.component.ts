import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-supervisor-campaign-status',
  templateUrl: './supervisor-campaign-status.component.html',
  styleUrls: ['./supervisor-campaign-status.component.css']
})
export class SupervisorCampaignStatusComponent implements OnInit {
  // campaignStatusUrl: any;
  constructor(private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private saved_data: dataService) { }

  ngOnInit() {

    // let url = this.configService.getTelephonyServerURL() + "adminui.php?campaignStatus";
    // console.log("url = " + url);
    // this.campaignStatusUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
