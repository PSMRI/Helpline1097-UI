import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';

@Component( {
  selector: 'app-supervisor-reports',
  templateUrl: './supervisor-reports.component.html',
  styleUrls: [ './supervisor-reports.component.css' ]
} )
export class SupervisorReportsComponent implements OnInit
{
  // http://10.201.13.17/adminui.php?reportUI
  reportsURL: any;
  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit ()
  {
    let url = this.configService.getTelephonyServerURL() + "adminui.php?reportUI";
    console.log( "url = " + url );
    this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl( url );
  }

}
