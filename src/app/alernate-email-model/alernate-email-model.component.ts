import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
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

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public dialogReff: MdDialogRef<AlernateEmailModelComponent>) { }


  ngOnInit() {
    this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  }


}
