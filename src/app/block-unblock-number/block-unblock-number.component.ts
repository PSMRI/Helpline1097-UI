import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dataService } from './../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service'


@Component({
  selector: 'app-block-unblock-number',
  templateUrl: './block-unblock-number.component.html',
  styleUrls: ['./block-unblock-number.component.css']
})
export class BlockUnblockNumberComponent implements OnInit {

  phoneNumber: number;
  maxDate: Date;
  blockedDate: any;
  blockedTill: any;
  showTable: boolean = false;
  isBlocked: boolean;
  reason: any;
  blockedBy: string;
  blockForm: FormGroup;
  serviceId: any;

  constructor(private commonData: dataService, private callService: CallServices) { }

  ngOnInit() {
    this.serviceId = this.commonData.current_service.serviceId;
    this.maxDate = new Date();
  }

  getBlockedTillDate(date) {
    this.blockedTill = date.setDate(date.getDate() + 7);
    console.log(this.blockedTill);
  }

  addToBlockList() {
    debugger;
    const searchObj = {};
    searchObj['providerServiceMapID'] = this.serviceId;
    searchObj['phoneNumber'] = this.phoneNumber;
    searchObj['startDate'] = this.blockedDate;
    searchObj['endDate'] = this.blockedTill;
    searchObj['blockedBy'] = this.blockedBy;
    searchObj['reason'] = this.reason;
    searchObj['isBlocked'] = Boolean(this.isBlocked);
    this.isBlocked = Boolean(this.isBlocked);

    this.callService.getBlackListCalls(searchObj).subscribe((response) => {
      this.showTable = true;
    }, (err) => {
      this.showTable = false;
    });
  }
  unblock() {

  }
  block() {

  }
}
