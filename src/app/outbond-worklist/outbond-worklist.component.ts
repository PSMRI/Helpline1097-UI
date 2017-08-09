import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { dataService } from '../services/dataService/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundWorklistService } from '../services/outboundServices/outbound-work-list.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
declare var jQuery: any;


@Component({
  selector: 'app-outbond-worklist',
  templateUrl: './outbond-worklist.component.html',
  styleUrls: ['./outbond-worklist.component.css']
  //providers:[OCWService]
})

export class OutbondWorklistComponent implements OnInit {

  @Output() onTableRowSelection: EventEmitter<any> = new EventEmitter<any>();
  @Output() sioOutboundList: EventEmitter<any> = new EventEmitter<any>();  // ye b naya h


  public showCreateFlag = false;
  serviceProviders: string[];
  outbondWorklist: any;

  bloodOutbondWorklist = [];
  diabeticBPOutbondWorklist = [];
  coOutbondWorklist = [];

  historyDetails: any;
  _today: Date;
  data: any;
  agentData: any;
  current_role: any;

  constructor(private _OWLService: OutboundWorklistService, private _dataServivce: dataService, public dialog: MdDialog) {
    this.serviceProviders;
  }

  ngOnInit() {
    this.current_role = this._dataServivce.current_role;
    this._today = new Date();
    this.agentData = this._dataServivce.Userdata;

    this.data = { assignedUserID: this._dataServivce.uid, providerServiceMapID: this._dataServivce.current_service.serviceID };
    console.log(JSON.stringify(this.data));
    this._OWLService.getCallWorklist(this.data)
      .subscribe(resProviderData => {
        this.outbondWorklist = resProviderData
        console.log(JSON.stringify(this.outbondWorklist));
        this.filterWorkList();
      });


  }

  filterWorkList() {
    let totWorkListItems = this.outbondWorklist.length;
    for (let i = 0; i < totWorkListItems; i++) {
      if (this.outbondWorklist[i].requestedService.subServiceName == 'Blood On Call')
        this.bloodOutbondWorklist.push(this.outbondWorklist[i]);
      else if (this.outbondWorklist[i].requestedService.subServiceName == 'CO')
        this.coOutbondWorklist.push(this.outbondWorklist[i]);
      else
        this.diabeticBPOutbondWorklist.push(this.outbondWorklist[i]);
    }

  }

  //   modaldata:any;
  viewHistory(data: any, i: any) {
    this.onTableRowSelection.emit(data);
    console.log(i, this.outbondWorklist[i]);

    // this._dataServivce.sio_outbond_providerlist = this.outbondWorklist[i];
    this.sioOutboundList.emit(this.outbondWorklist[i]);

    var idx = jQuery('.carousel-inner div.active').index();
    jQuery('#myOutCarousel').carousel(idx + 1);
    jQuery('#outTwo').parent().find("a").removeClass('active-tab');
    jQuery('#outTwo').find("a").addClass("active-tab");
  }

  tab: number = 1;
  changeService(val) {
    this.tab = val;
    jQuery("#service" + val).parent().find("li").removeClass();
    jQuery("#service" + val).addClass("animation-nav-active");

    jQuery("#service" + val).parent().find('a').removeClass();
    jQuery("#service" + val + " a").addClass("f-c-o");
  }
}
