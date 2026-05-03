import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";

@Component({
  selector: 'app-complaint-description-dialog',
  templateUrl: './complaint-description-dialog.component.html',
  styleUrls: ['./complaint-description-dialog.component.css']
})
export class ComplaintDescriptionDialogComponent implements OnInit {

  currentLanguageSet: any;
  complaintData: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ComplaintDescriptionDialogComponent>,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();

    this.complaintData = this.data.complaintData;
   
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
