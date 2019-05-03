import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-view-version-details',
  templateUrl: './view-version-details.component.html',
  styleUrls: ['./view-version-details.component.css']
})
export class ViewVersionDetailsComponent implements OnInit {

  version_UI: any;
  commitID_UI: any;
  version_api: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<ViewVersionDetailsComponent>,
    private confirmationDialogsService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("input", this.input)
   
  }
  uiVersionDetails(versionDetails) {
    this.version_UI = versionDetails.version;
    this.commitID_UI = versionDetails.commit;
  }
}
