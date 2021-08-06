import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  constructor(public dialogRef: MdDialogRef<CommonDialogComponent>,public HttpServices: HttpServices) { }

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
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
}
