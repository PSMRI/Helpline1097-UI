import { Component, OnInit } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
declare var jQuery: any;
@Component({
  selector: 'app-outbound-call-worklists',
  templateUrl: './outbound-call-worklists.component.html',
  styleUrls: ['./outbound-call-worklists.component.css']
})
export class OutboundCallWorklistsComponent implements OnInit {
  currentLanguageSet: any;

  constructor(public httpServices: HttpServices) { }
  selectedIndex:any=0;
  ngOnInit() {
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

}
