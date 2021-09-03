import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-common-sms-dialog',
  templateUrl: './common-sms-dialog.component.html',
  styleUrls: ['./common-sms-dialog.component.css']
})
export class CommonSmsDialogComponent implements OnInit {

  altNum = false;
  mobileNumber: any;
  validNumber = false;
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<CommonSmsDialogComponent>,
    public getCommonData: dataService,
    public HttpServices: HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    } else {
      this.validNumber = false;
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
