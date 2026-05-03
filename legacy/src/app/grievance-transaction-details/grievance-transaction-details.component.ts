import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";

@Component({
  selector: 'app-grievance-transaction-details',
  templateUrl: './grievance-transaction-details.component.html',
  styleUrls: ['./grievance-transaction-details.component.css']
})
export class GrievanceTransactionDetailsComponent implements OnInit {
  currentLanguageSet: any;
  transactionList: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, 
  public dialogRef: MdDialogRef<GrievanceTransactionDetailsComponent>,
  public HttpServices: HttpServices,
  private alertMessage: ConfirmationDialogsService,) { }

  ngOnInit() {
    this.assignSelectedLanguage();

    this.transactionList = this.data;
   
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  }

  toUTCDate(date) {
    const _utc = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return _utc;
  }




  viewTransactionFile(fileUrl:any) {
      if (fileUrl && fileUrl.fileName) {
        const sanitizedUrl = fileUrl.fileName.replace(/\\/g, '');
        const fileExtension = fileUrl.fileName.split('.').pop().toLowerCase();

        window.open(sanitizedUrl, '_blank');
      } else {
        this.alertMessage.alert(this.currentLanguageSet.fileIsNotAvailable, 'info');
      }
  }



}
