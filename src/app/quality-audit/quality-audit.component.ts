import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config/config.service';

@Component( {
  selector: 'app-quality-audit',
  templateUrl: './quality-audit.component.html',
  styleUrls: [ './quality-audit.component.css' ]
} )
export class QualityAuditComponent implements OnInit
{
  qualityAuditURL: any;
  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit ()
  {
    this.qualityAuditURL = this.configService.getTelephonyServerURL() + "adminui.php?voice_logger";
  }

  showSearchPanel: boolean = true;
  findRecordings ()
  {
    this.showSearchPanel = false;
  }

  refineSearch ()
  {
    this.showSearchPanel = true;
  }

  play ()
  {
    confirm( "WINDOWS MEDIA PLAYER" );
  }

  saveRatings ()
  {
    alert( 'Give your remarks/ratings in a modal window some days later... WORK IN PROGRESS' );
  }

}
