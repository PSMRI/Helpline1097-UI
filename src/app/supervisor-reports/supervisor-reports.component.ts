import { Component, OnInit } from '@angular/core';
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
    private configService: ConfigService
  ) { }

  ngOnInit ()
  {
    this.reportsURL = this.configService.getTelephonyServerURL() + "adminui.php?reportUI";
  }

}
