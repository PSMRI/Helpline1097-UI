import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-co-alternate-number',
  templateUrl: './co-alternate-number.component.html',
  styleUrls: ['./co-alternate-number.component.css']
})
export class CoAlternateNumberComponent implements OnInit {
  altNum: any = false;
  mobileNumber: any;
  validNumber: any = false;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<CoAlternateNumberComponent>) { }

  ngOnInit() {
  }

  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    } else {
      this.validNumber = false;
    }
  }

}
