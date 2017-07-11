import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
    private configService: ConfigService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit ()
  {
    let url = this.configService.getTelephonyServerURL() + "adminui.php?voice_logger";
    console.log( "url = " + url );
    this.qualityAuditURL = this.sanitizer.bypassSecurityTrustResourceUrl( url );
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
