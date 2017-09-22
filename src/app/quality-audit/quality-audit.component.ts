import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-quality-audit',
  templateUrl: './quality-audit.component.html',
  styleUrls: ['./quality-audit.component.css']
})
export class QualityAuditComponent implements OnInit {
  qualityAuditURL: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private saved_data: dataService
  ) { }

  ngOnInit() {
    this.qualityAuditURL = this.configService.getTelephonyServerURL() + 'remote_login.php?username='
      + this.saved_data.uname + '&key=' + this.saved_data.loginKey;
    this.qualityAuditURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.qualityAuditURL);
    console.log('reportsURL: ' + this.qualityAuditURL);
    // let url = this.configService.getTelephonyServerURL() + "adminui.php?voice_logger";
    // console.log("url = " + url);
    // this.qualityAuditURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  showSearchPanel: boolean = true;
  findRecordings() {
    this.showSearchPanel = false;
  }

  refineSearch() {
    this.showSearchPanel = true;
  }

  play() {
    confirm("WINDOWS MEDIA PLAYER");
  }

  saveRatings() {
    alert('Give your remarks/ratings in a modal window some days later... WORK IN PROGRESS');
  }

}
