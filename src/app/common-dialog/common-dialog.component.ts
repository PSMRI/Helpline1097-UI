import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';


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
  constructor(public dialogRef: MdDialogRef<CommonDialogComponent>) { }

  ngOnInit() {
  }
  Confirm() {
    this.cancelEvent.emit(null);
  }
}
