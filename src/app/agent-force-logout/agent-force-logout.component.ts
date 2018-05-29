import { Component, OnInit,ViewChild} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-agent-force-logout',
  templateUrl: './agent-force-logout.component.html',
  styleUrls: ['./agent-force-logout.component.css']
})
export class AgentForceLogoutComponent implements OnInit {

  constructor(private dialog: MdDialog,
     public dialogRef: MdDialogRef<AgentForceLogoutComponent>,
    private commonData: dataService,
      private alertService: ConfirmationDialogsService,
    private forceLogoutService:ForceLogoutService) { }

  ngOnInit() {
  }

}
