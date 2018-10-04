import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public dialogReff: MdDialogRef<AlernateEmailModelComponent>,  public feedbackService: FeedbackService, 
    public fb: FormBuilder, public alertService: ConfirmationDialogsService) {
      this.emailForm = this.fb.group({
        emails: this.fb.array([])
      });
     }

  ngOnInit() {
    this.feedbackID = this.data.feedbackID;
    let obj = {
      // districtID : this.data.districtID
      districtID: 1
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
