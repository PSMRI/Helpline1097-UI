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


import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {
  @Output() cancelEvent = new EventEmitter();
  public title: string;
  public message: string;
  public btnOkText?: string;
  public btnCancelText?: string;
  public alert: boolean;
  public confirmAlert: boolean;
  public remarks: boolean;
  public status: string;
  currentLanguageSet: any;
  httpServices: HttpServices;

  constructor(public dialogRef: MdDialogRef<CommonDialogComponent>,private injector: Injector) {
    this.httpServices = injector.get(HttpServices);
   }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  Confirm() {
    this.cancelEvent.emit(null);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
}
