import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config/config.service';

@Component( {
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: [ './agent-status.component.css' ]
} )
export class AgentStatusComponent implements OnInit
{

  constructor(
    private configService: ConfigService
  ) { }
  //http://10.201.13.17/adminui.php?agentStatus
  agentStatusURL: any;
  ngOnInit ()
  {
    //this.agentStatusURL = "http://10.201.13.17/adminui.php?agentStatus";
    this.agentStatusURL = this.configService.getTelephonyServerURL() + "adminui.php?agentStatus";
  }
  selection: any = "";
}
