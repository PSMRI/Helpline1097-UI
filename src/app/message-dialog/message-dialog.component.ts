import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<MessageDialogComponent>) { }

  ngOnInit() {
  	console.log(this.data,"DATA IN MESSAGE DIALOG WINDOW");
  	this.checkForURL(this.data.message);
  }


urls=[];

  checkForURL(string)
  {
  	var matches=[];
  	matches=string.match(/\bhttp[s,]?:\/\/\S+/gi);
  	console.log("matches",matches);
  	if(matches.length>0)
  	{
  		this.urls=matches;
  	}
  }

}
