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
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpServices } from '../services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-alernate-email-model',
  templateUrl: './alernate-email-model.component.html',
  styleUrls: ['./alernate-email-model.component.css']
})
export class AlernateEmailModelComponent implements OnInit {
   altEmail: any = false;
  email: any;
  file: any;
  fileContent: any;
  emailPattern: any;
  valid_file_extensions = ['msg', 'pdf', 'doc', 'docx', 'txt'];
  invalid_file_flag = false;
  emails = [];
  feedbackID: any;
  disableFlag : boolean = false;

  // emailForm: FormGroup;
  emailForm: FormGroup = new FormGroup({
    emails: new FormArray([])
  });
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public dialogReff: MdDialogRef<AlernateEmailModelComponent>,  public feedbackService: FeedbackService, 
    public fb: FormBuilder, public alertService: ConfirmationDialogsService,private HttpServices:HttpServices) {
      this.emailForm = this.fb.group({
        emails: this.fb.array([])
      });
     }
     ngDoCheck() {
      this.assignSelectedLanguage();
    }
  
    assignSelectedLanguage() {
      const getLanguageJson = new SetLanguageComponent(this.HttpServices);
      getLanguageJson.setLanguage();
      this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.feedbackID = this.data.feedbackID;
    let obj = {
      districtID : this.data.districtID
      // districtID: 1
    }
    this.feedbackService.fetchEmails(obj).subscribe(res => {
      this.handleSuccess(res)
    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
      })
    this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  }

  handleSuccess(res) {
    this.emails = res;
  }

  addInputField() {
    (<FormArray>this.emailForm.get('emails')).push(this.fb.group({ email: null }));
  }
  deleteInputField(index) {
    (<FormArray>this.emailForm.get('emails')).removeAt(index);
  }

  sendEmail(mailid, manual) {
    let autoEmails = mailid.join();
    let manualEmails= '';
    let finalEmails;
    if (manual.emails.length > 0) {
      for(let i=0; i<manual.emails.length; i++){
        manualEmails += manual.emails[i].email+',';
      }
      finalEmails = autoEmails+','+manualEmails.slice(0,-1);
    }
    else {
      finalEmails = autoEmails;
    }
    let obj = {
      "FeedbackID": this.feedbackID,
      "emailID": finalEmails,
      "is1097": true
    }
    this.feedbackService.sendEmail(obj).subscribe(res => {
      console.log('email sent');
      this.dialogReff.close();
    },
      (err) => {
        this.dialogReff.close();
        console.log("Error while sending email");
      })
  }
  controll(){
    return <FormArray>this.emailForm.get('emails')['controls'];
  }
}
