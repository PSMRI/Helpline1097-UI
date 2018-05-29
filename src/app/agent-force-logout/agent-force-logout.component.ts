import { Component, OnInit, ViewChild } from '@angular/core';
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

  providerServiceMapID: any;
  @ViewChild('forceLogoutForm') agentForceLogoutForm: NgForm;

  constructor(private dialog: MdDialog,
    public dialogRef: MdDialogRef<AgentForceLogoutComponent>,
    private commonData: dataService,
    private alertService: ConfirmationDialogsService,
    private forceLogoutService: ForceLogoutService) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonData.current_service.serviceID;
  }

  kickout(obj) {
    obj['providerServiceMapID'] = this.providerServiceMapID;
    this.forceLogoutService.agentForceLogout(obj)
      .subscribe(response => {
        console.log(response, 'Success post agent force logout');
        this.alertService.alert('User logged out successfully', 'success');
        this.agentForceLogoutForm.reset();
        this.dialogRef.close();
      }, err => {
        console.log(err, 'error post agent force logout');
        this.alertService.alert(err.errorMessage, 'error');
      });
  }

}
