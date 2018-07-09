import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-common-sms-dialog',
  templateUrl: './common-sms-dialog.component.html',
  styleUrls: ['./common-sms-dialog.component.css']
})
export class CommonSmsDialogComponent implements OnInit {

  altNum = false;
  mobileNumber: any;
  validNumber = false;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<CommonSmsDialogComponent>,
    public getCommonData: dataService) { }

  ngOnInit() {
  }

  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    } else {
      this.validNumber = false;
    }
  }

}
