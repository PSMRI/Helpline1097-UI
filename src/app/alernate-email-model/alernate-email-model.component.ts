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
  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public dialogReff: MdDialogRef<AlernateEmailModelComponent>) { }


  ngOnInit() {


  }
}
