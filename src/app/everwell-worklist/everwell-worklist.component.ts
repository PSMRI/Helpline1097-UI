import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { ThemePalette } from '@angular/material/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { RegisterService } from '../services/register-services/register-service';
import { CallServices } from '../services/callservices/callservice.service';
import { DatePipe } from'@angular/common';


@Component({
  selector: 'app-everwell-worklist',
  templateUrl: './everwell-worklist.component.html',
  styleUrls: ['./everwell-worklist.component.css']
})
export class EverwellWorklistComponent implements OnInit {
  // flags
  showTable = true;  
  showEditForm = false;
  name: any;
  showCalender= false;
  @Output() everwellBeneficiarySelected: EventEmitter<any> = new EventEmitter<any>();

  //Calender
  val: string; date: Date;
  currentmonth: string;
  msg: boolean;
  current: boolean;
  aftermonth: string;
  aftermonth2: string;
  beforemonth: string;
  beforemonth2: string;

  data: any = [];
  previous: number;
  previousDay: string;
  constructor(public dialog: MdDialog, private OCRService: OutboundReAllocationService,
     private _common: dataService, public router: Router,public alertService: ConfirmationDialogsService,
     private _util: RegisterService,private alertMaessage: ConfirmationDialogsService
     ) {
  }
  ngOnInit() {
    this._common.sendHeaderStatus.next("");
    const serviceProviderMapID = this._common.current_service.serviceID;
    const userId = this._common.uid;
    this.getcurrentmonth();
    let reqObj = {
      "providerServiceMapId": serviceProviderMapID,
      "agentId": userId
    };      
    // if (this._common.current_campaign == 'OUTBOUND') {
    //   this.startOutBoundCall(this._common.outboundEverwellData);
    // }
    this.startOutBoundCall(this._common.outboundEverwellData);
  }
  tableMode() {
    this.showTable = true;
    this.showCalender = false;
    this.showEditForm = false;
  }
  editMode(benData:any) {
    if(benData){
    this.showTable = false;
    this.showEditForm = false;
    this.showCalender = true;
    this.everwellBeneficiarySelected.emit(benData);    
    }
  }
  getcurrentmonth() {
    var curmonth = new Date();
    this.currentmonth = this.daysmonth[curmonth.getMonth()].name;

    var am = new Date();
    this.aftermonth = this.daysmonth[((am.getMonth()) + 2)].name;
    var am1 = new Date();
    this.aftermonth2 = this.daysmonth[((am1.getMonth()) + 1)].name;

    var bm = new Date();
    this.beforemonth = this.daysmonth[((bm.getMonth()) - 2)].name;
    var bm1 = new Date();
    this.beforemonth2 = this.daysmonth[((bm1.getMonth()) - 1)].name;

    this.daysmonth = this.daysmonth.filter(
      m => m.name.toString() == this.currentmonth ||
       // m.name.toString() == this.aftermonth ||
        // m.name.toString() == this.aftermonth2 ||
        m.name.toString() == this.beforemonth ||
        m.name.toString() == this.beforemonth2
    );
  }
  callsupportdialog() {
    var curmonth = new Date();
    curmonth.setDate(curmonth.getDate() - 1);
    this.previousDay =curmonth.toLocaleString('en-US',{hour12:false}).split(" ")[0];
    this.previousDay = this.previousDay.substring(0,9);
    let dialog_Ref = this.dialog.open(SupportActionModal, {
      height: '400px',
      width: '700px',
      disableClose: true,
      data: this.previousDay
    });
    dialog_Ref.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      if (result === "success") {
       // this.dialogService.alert("Updated successfully", 'success');
        //this.getAllProviderAdminDetails();
        //this.tableMode = true;
        //this.formMode = false;
        //this.editMode = false;
      }
    });
  }
  checkcurrent(name) {
    this.currentdaysactive(name);
    if (this.currentmonth == name) {
      this.current = true;
      return true;
    }
    else {
      this.current = false;
      return false;
    }
  }
  currentdaysactive(month) {
    var c = 0; this.date = new Date();
    this.val = new Date().toDateString();
    for (var i = 0; i < this.val.length; i++) {
      if (this.val.charAt(i) == ' ') {
        c++;
        if (c == 2) {
          var days = this.val.substring(i + 1, i + 3);
          break;
        }
      }
    }
    this.previous=Number(days)-1;
  }
  currentdaysInactive(val) {
    this.currentdaysactive(val); var ar: number[] = [];
    for (var i = this.previous + 1; i <= val; i++) {
      ar.push(i);
    }
    return ar;
  }
  message() {
    this.msg = true;
  }
  daysmonth: month[] = [

    { name: 'January', days: 31 },
    { name: 'February', days: 29 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 30 },
    { name: 'August', days: 30 },
    { name: 'September', days: 30 },
    { name: 'October', days: 30 },
    { name: 'November', days: 30 },
    { name: 'December', days: 30 },

  ];
  availableColors: ChipColor[] = [
    { name: '', color: 'red' },
    { name: '', color: 'green' },
    { name: '', color: 'blue' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'primary' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'accent' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'primary' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'warn' },
    { name: '', color: 'primary' },
    { name: '', color: 'accent' },
    { name: '', color: 'warn' }
  ];
  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
  
  startOutBoundCall(outboundData: any) {
    if(outboundData)
    {
    console.log('everwelldata'+ JSON.stringify(outboundData));
    
    this.data.callID = this._common.callID;
    this.data.is1097 = true;
    //this.data.createdBy = outboundData.everwelldata.createdBy;
    this.data.calledServiceID = outboundData.providerServiceMapId;
    this.data.primaryNumber = outboundData.primaryNumber;
    this.data.agentID = outboundData.agentId;
    this.data.beneficiaryRegId = outboundData.beneficiaryRegId;
    this.data.firstName = outboundData.firstName;
    this.data.lastName = outboundData.lastName;
    this.data.remarks = outboundData.comments;
    this.data.outBoundCallID = outboundData.eapiId;
    this.data.state = outboundData.state;
    this.data.gender = outboundData.gender;
    this.data.district = outboundData.district;

    const startCallData: any = {};
    startCallData.callID = this._common.callID;
    startCallData.is1097 = true;
    startCallData.createdBy = this._common.uname;
    startCallData.calledServiceID = this._common.current_service.serviceID;
    startCallData.phoneNo = this._common.callerNumber;
    startCallData.agentID = this._common.cZentrixAgentID;    
    startCallData.callReceivedUserID = this._common.uid;
    startCallData.receivedRoleName = this._common.current_role.RoleName;   
    startCallData.beneficiaryRegID = outboundData.beneficiaryRegId;
    startCallData.isOutbound = this._common.isOutbound;
    this._util.startCall(startCallData).subscribe((response) => { this.setBenCall(response) }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('ERROR', err);

    });
    console.log('primaryNumber'+ this.data.primaryNumber);    
  } 
}
setBenCall(response) {
  this._common.callData = response;
}

}
export interface ChipColor {
  name: string;
  color: string;

}
export interface month {
  name: string;
  days: number;
}
@Component({
  selector: 'SupportActionModal',
  templateUrl: './support.component.html',
  //styleUrls: ['./provider-admin-list.component.css']
  providers: [ DatePipe ] 
})
export class SupportActionModal {
  // arrays  
  
  subcategries:any=["Dose not taken","Dose taken but did not call TFN","Called & Counselled","Phone not reachable","Phone switched off","Did not receive the cal","Others"];  
  category:any=["Support_Action_Call"];
  comments:any;
  dob: any;
  actionTaken:any=["Call"]

  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;

  @ViewChild('editAdminCreationForm') editAdminCreationForm: NgForm;
  everwellBenData: any;

  constructor(@Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog,private _common: dataService, private _callservice:CallServices,public datepipe:DatePipe,
  private alertMaessage: ConfirmationDialogsService,public dialogRef: MdDialogRef<SupportActionModal>)
    { }

  ngOnInit() {
    //console.log("Initial value", this.data);
    // this.superadminService.getCommonRegistrationData().subscribe(response => this.showGenderOnCondition(response));
    // this.superadminService.getAllQualifications().subscribe(response => this.getEduQualificationSuccessHandler(response));
    // this.superadminService.getAllMaritalStatus().subscribe(response => this.showAllMaritalSuccessHandler(response));
   // this.edit();
   this.everwellBenData = this._common.outboundEverwellData;
   console.log('EverWell Ben Data'+ this.everwellBenData);
   this.dob=this.data;
  }

  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  submitFeedback(item){
    if(!this._common.outboundEverwellData)
    {
      this.alertMaessage.alert("Please select Beneficiary", 'error');
      return false;
    }
    const providerObj = {};
    providerObj['eapiId'] = this._common.outboundEverwellData.eapiId;
    providerObj['missedDoses'] = 5;
    providerObj['category'] = item.category[0];
    providerObj['subCategory'] = item.subcategory;
    providerObj['adherencePercentage'] = 8;
    providerObj['actionTaken'] = item.actionTaken[0];
    providerObj['comments'] = item.comments;
    providerObj['dateOfAction'] = this.datepipe.transform(new Date(item.dob), 'yyyy-MM-dd');   
   
    this._callservice.postEverwellFeedback(providerObj).subscribe((response) => {
      if(response.response == "1"){
        this.alertMaessage.alert('Feedback updated successfully', 'success');
        this.dialogRef.close();
        console.log('Feedback updated successfully', response);
      }
    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('error in submit Feedback');
    });
  }

}
