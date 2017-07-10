import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-block-unblock-number',
  templateUrl: './block-unblock-number.component.html',
  styleUrls: [ './block-unblock-number.component.css' ]
} )
export class BlockUnblockNumberComponent implements OnInit
{

  phoneNumber: number;
  constructor() { }

  ngOnInit ()
  {
  }

  
  blockedDate:any;
  blockedTill:any;
  
  getBlockedTillDate(date)
  {
    this.blockedTill = date.setDate( date.getDate() + 7 );
    console.log( this.blockedTill );
  }


  showTable: boolean = false;
  addToBlockList ()
  {
    this.showTable = true;
  }
}
