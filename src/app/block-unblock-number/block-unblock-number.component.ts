import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dataService } from './../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'

declare var jQuery:any;

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
  isBlockedType: boolean;
  showTable: boolean = false;
  isBlocked: boolean = undefined;
  isUnBlocked: boolean = undefined;
  reason: any;
  blockedBy: string;
  blockForm: FormGroup;
  serviceId: any;
  blackList: any = [];
  searchByPhone: boolean = false;
  data: any = [];
  recording_data:any=[];
  showRecordings:boolean=false;
  audio_path:any;
  constructor(private commonData: dataService, private callService: CallServices,
              private message: ConfirmationDialogsService) {


   


               }

  ngOnInit() {
    // this.isBlockedType = undefined;
    this.serviceId = this.commonData.current_service.serviceID;
    this.maxDate = new Date();
    this.addToBlockList();

  }




  getBlockedTillDate(date) {
    this.blockedTill = date.setDate(date.getDate() + 7);
    console.log(this.blockedTill);
  }

  addToBlockList() {
    const searchObj = {};
    searchObj['providerServiceMapID'] = this.serviceId;
    searchObj['phoneNo'] = this.phoneNumber;
    // searchObj['isBlocked'] = this.isBlockedType;
    this.isBlocked = Boolean(this.isBlocked);
    this.callService.getBlackListCalls(searchObj).subscribe((response) => {
      this.showTable = true;
      this.setBlackLists(response);
    }, (err) => {
      this.showTable = false;
    });
  }
  setBlackLists(blackListData: any) {
    this.data = blackListData;
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
                          date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  unblock(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.UnBlockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert('Successfully Unblocked.');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status);
    })
  }
  block(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.blockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert('Successfully blocked.');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status);
    })
  }
  getBlackList(e: any) {
    if (!e.checked) {
      this.phoneNumber = undefined;
      this.addToBlockList();
    }

  }

  getRecording(obj)
  {
    if(obj)
    {
      let requestObj={
        "calledServiceID":this.serviceId,
        "phoneNo":obj.phoneNo,
        "count":obj.noOfNuisanceCall
      }

      this.callService.getRecording(requestObj).subscribe(response=>this.getRecordingsSuccessHandeler(response,obj.phoneNo));
    }
    
  }

ph_no="";
  getRecordingsSuccessHandeler(response,ph_no)
  {
    console.log(response,"get RECORDINGS SUCCESS");
    if(response)
    {
      this.recording_data=response;  
      this.showRecordings=true;
      this.audio_path=response[0].recordingPath;
    }

    this.ph_no=ph_no;
    
  }
}
