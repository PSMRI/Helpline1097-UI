/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
