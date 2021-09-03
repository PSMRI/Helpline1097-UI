import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: ['./agent-status.component.css']
})
export class AgentStatusComponent implements OnInit {
  agentStatusURL: any;
  selection: any = "";
  currentLanguageSet: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer, private saved_data: dataService,private HttpServices:HttpServices
  ) { }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.agentStatusURL = "http://10.201.13.17/adminui.php?agentStatus";
    let url = this.configService.getTelephonyServerURL() + "adminui.php?agentStatus";
    console.log("url = " + url);
    this.agentStatusURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
