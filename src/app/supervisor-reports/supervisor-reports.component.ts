import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-supervisor-reports',
  templateUrl: './supervisor-reports.component.html',
  styleUrls: ['./supervisor-reports.component.css']
})
export class SupervisorReportsComponent implements OnInit {
  // http://10.201.13.17/adminui.php?reportUI
  reportsURL: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private saved_data: dataService
  ) { }

  ngOnInit() {
    // this.reportsURL = this.configService.getTelephonyServerURL() + 'remote_login.php?username='
    //   + this.saved_data.uname + '&key=' + this.saved_data.loginKey;
    // this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportsURL);
    // console.log('reportsURL: ' + this.reportsURL);
    let url = this.configService.getTelephonyServerURL() + "adminui.php?reportUI";
    console.log("url = " + url);
    this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
