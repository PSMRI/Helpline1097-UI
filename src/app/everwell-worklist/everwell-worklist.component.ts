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
    this.showTable = false;
    this.showEditForm = false;
    this.showCalender = true;
    this.everwellBeneficiarySelected.emit(benData);    
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
        m.name.toString() == this.aftermonth ||
        m.name.toString() == this.aftermonth2 ||
        m.name.toString() == this.beforemonth ||
        m.name.toString() == this.beforemonth2
    );
  }
  callsupportdialog() {
    console.log("Existing Data");
    let dialog_Ref = this.dialog.open(SupportActionModal, {
      height: '500px',
      width: '1000px',
      disableClose: true,
      //data: item
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
    if (this.currentmonth == name) {
      this.current = true;
      return true;
    }
    else {
      this.current = false;
      return false;
    }
  }
  currentdaysactive() {
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
    return Number(days);
  }
  currentdaysInactive(val) {
    var active = this.currentdaysactive(); var ar: number[] = [];
    for (var i = active + 1; i <= val; i++) {
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
  call(a) {
    alert("clicked" + a);
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
})
export class SupportActionModal {

  //ngModel

  titleID: any;
  admin_firstName: any;
  admin_middleName: any;
  admin_lastName: any;
  gender: any;
  dob: Date;
  age: any;
  primaryMobileNumber: any;
  primaryEmail: any;
  marital_status: any;
  aadharNumber: any;
  panNumber: any;
  edu_qualification: any;
  emergency_cnt_person: any;
  emergencyMobileNumber: any;
  admin_remarks: any;
  today = new Date();
  mindate: any;
  maxdate: any;
  formMode: boolean = true;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  errorMessageForAadhar: string;
  errorMessageForPan: string;
  subcategory:any=["Dose not taken","Dose taken but did not call TFN","Called & Counselled","Phone not reachable","“Phone switched off","“Did not receive the cal","Others"];
  // arrays
  genders: any = [];
  genderID: any = [];
  titles: any = [];
  eduQualification: any = [];
  maritalStatus: any = [];
  allProviderAdmin: any = [];

  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;

  @ViewChild('editAdminCreationForm') editAdminCreationForm: NgForm;

  constructor(@Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog)
    { }

  ngOnInit() {
    //console.log("Initial value", this.data);
    // this.superadminService.getCommonRegistrationData().subscribe(response => this.showGenderOnCondition(response));
    // this.superadminService.getAllQualifications().subscribe(response => this.getEduQualificationSuccessHandler(response));
    // this.superadminService.getAllMaritalStatus().subscribe(response => this.showAllMaritalSuccessHandler(response));
   // this.edit();
  }

  edit() {
    this.titleID = this.data.titleID;
    this.admin_firstName = this.data.firstName;
    this.admin_middleName = this.data.middleName;
    this.admin_lastName = this.data.lastName;
    this.gender = this.data.genderID;
    this.primaryMobileNumber = this.data.contactNo;
    this.primaryEmail = this.data.emailID;
    this.dob = this.data.dOB;
    this.marital_status = this.data.maritalStatusID;
    this.aadharNumber = this.data.aadhaarNo;
    this.panNumber = this.data.pAN;
    this.edu_qualification = this.data.qualificationID;
    this.emergency_cnt_person = this.data.emergencyContactPerson;
    this.emergencyMobileNumber = this.data.emergencyContactNo;
    this.admin_remarks = this.data.remarks;
    this.resetDob();

  }
  /*
* Reset the dob on adding multiple objects
*/
  resetDob() {
    // this.maxdate = new Date();
    // this.maxdate.setFullYear(this.today.getFullYear() - 20);
    // this.mindate = new Date();
    // this.mindate.setFullYear(this.today.getFullYear() - 70);
    // this.calculateAge();
    this.dob = new Date();
    this.dob.setHours(0);
    this.dob.setMinutes(0);
    this.dob.setSeconds(0);
    this.dob.setMilliseconds(0);
    // setting dob as min 14 years to restrict child labour
    this.dob.setFullYear(this.today.getFullYear() - 14);
    this.maxdate = new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 14);
    this.mindate = new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.calculateAge(this.dob);
  }
  /*
 * Display gender on condition
 */

  setGenderOnCondition() {
    if (this.titleID == 2 || this.titleID == 4 || this.titleID == 5 || this.titleID === 13) {
      this.gender = 2;
    }
    else if (this.titleID == 3 || this.titleID == 8) {
      this.gender = 1;
    }
    else {
      this.gender = "";
    }
  }
  showGenderOnCondition(response) {
    console.log("Display gender on condition", response);
    this.titles = response.m_Title;
    this.genders = response.m_genders;
  }
  /*
    * Calculate age
    */
  calculateAge(dob) {
    if (dob != undefined) {
      let existDobAge = new Date(dob)
      this.age = this.today.getFullYear() - existDobAge.getFullYear();
      const month = this.today.getMonth() - existDobAge.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < existDobAge.getDate())) {
        this.age--; //age is ng-model of AGE
      }
    }
  }
  /*
* Success Handlers
*/
  getAllProviderAdminDetailsSuccessHandler(response) {
    console.log("All provider details", response);
    this.allProviderAdmin = response;
  }
  getEduQualificationSuccessHandler(response) {
    console.log("Admin qualification", response);
    this.eduQualification = response;
  }
  showAllMaritalSuccessHandler(response) {
    console.log("Marital status", response);
    this.maritalStatus = response;
  }
  /*
  * Check Uniqueness in Aadhar
  */
  // checkAadhar() {
  //   this.isExistAadhar = false;
  //   this.errorMessageForAadhar = '';
  //   if (this.aadharNumber != undefined && this.aadharNumber != null) {
  //     if (this.aadharNumber.length == 12) {
  //       this.superadminService.validateAadhar(this.aadharNumber).subscribe(
  //         (response: any) => {
  //           this.checkAadharSuccessHandler(response);
  //         },
  //         err => { console.log("Error", err); }
  //       );
  //     }
  //   }
  // }
  checkAadharSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistAadhar = true;
      this.errorMessageForAadhar = 'Aadhar number already exists';
    } else {
      this.isExistAadhar = false;
      this.errorMessageForAadhar = '';
    }
  }
  /*
    * Check Uniqueness in Pan
    */
  // checkPan() {
  //   this.isExistPan = false;
  //   this.errorMessageForPan = '';
  //   if (this.panNumber != undefined && this.panNumber != null) {
  //     if (this.panNumber.length == 10) {
  //       this.superadminService.validatePan(this.panNumber).subscribe(
  //         response => {
  //           console.log("pan response", response);
  //           this.checkPanSuccessHandler(response);
  //         },
  //         err => { }
  //       );
  //     }
  //   }
  // }
  checkPanSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistPan = true;
      this.errorMessageForPan = 'Pan number already exists';
    } else {
      this.isExistPan = false;
      this.errorMessageForPan = '';
    }
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    var update_tempObj = {
      'titleID': this.titleID,
      'firstName': this.admin_firstName,
      'middleName': this.admin_middleName,
      'lastName': this.admin_lastName,
      'genderID': this.gender,
      'dOB': this.dob,
      //  'age': this.age,
      'contactNo': this.primaryMobileNumber,
      'emailID': this.primaryEmail,
      'maritalStatusID': this.marital_status,
      'aadhaarNo': this.aadharNumber === "" ? null : this.aadharNumber,
      'pAN': this.panNumber === "" ? null : this.panNumber,
      'qualificationID': this.edu_qualification,
      'emergencyContactPerson': this.emergency_cnt_person,
      'emergencyContactNo': this.emergencyMobileNumber,
      'remarks': this.admin_remarks,
      'userID': this.data.userID,
      'modifiedBy': this.data.createdBy

    }
    // this.superadminService.updateProviderAdmin(update_tempObj).subscribe(response => {
    //   console.log("Data to be update", response);
    //   this.dialogRef.close("success")


  }



}
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./everwell-worklist.component.css']
})
export class DetailsComponent implements OnInit {
  date:Date;
  currentmonth:string;
  msg: boolean;
  current: boolean;
  aftermonth: string;
  aftermonth2: string;
  beforemonth: string;
  beforemonth2: string;
 // map=new Map([['January',31], ['February',28]]);
  
 // array= ["Angular keyvalue Pipe","Angular ngFor"]
  
  constructor(public dialog: MdDialog) { }

  ngOnInit() {
    this.getcurrentmonth();
    //alert("details");
  }
  
  getcurrentmonth() {
    var curmonth = new Date();
    this.currentmonth = this.daysmonth[curmonth.getMonth()].name;
   
    var am = new Date();
    this.aftermonth = this.daysmonth[((am.getMonth()) + 2)].name;
    var am1 = new Date();
    this.aftermonth2 = this.daysmonth[((am1.getMonth()) + 1)].name;
 
    var bm = new Date();
    this.beforemonth =this.daysmonth[((bm.getMonth()) - 2)].name;
    var bm1 = new Date();
    this.beforemonth2 =this.daysmonth[((bm1.getMonth()) - 1)].name;
 
    this.daysmonth = this.daysmonth.filter(
      m => m.name.toString() == this.currentmonth || 
      m.name.toString() == this.aftermonth ||
      m.name.toString() == this.aftermonth2 ||
      m.name.toString() == this.beforemonth ||
      m.name.toString() == this.beforemonth2 
      );
  }
  checkcurrent(name)
  {
    if(this.currentmonth==name)
    {
      this.current=true;
      return true;
    }
    else
    {
      this.current=false;
      return false;
    }
  }
  currentdaysactive()
  {
    var c=0;this.date=new Date();
    // this.val=new Date().toDateString();
    // var current = this.daysmonth[this.date.getDay()];
    // console.log("month="+this.date.getDate());
    // for(var i=0;i<this.val.length;i++)
    // {
    //   if(this.val.charAt(i)==' ')
    //   {
    //     c++;
    //     if(c==2)
    //     {
    //     var days=this.val.substring(i+1,i+3);
    //     break;
    //     }

    //   }
    // }
    return this.date.getDate();
  }
  currentdaysInactive(val)
  {
    var active=this.currentdaysactive();var ar: number[] = [];
    for(var i=active+1;i<=val;i++)
    {
      ar.push(i);
    }
    return ar;
  }
  message()
  {
    this.msg=true;
  }
  daysmonth:month[]=[
    
      {name:'January',days:31},
      {name:'February',days:29},
      {name:'March',days:31},
      {name:'April',days:30},
      {name:'May',days:31},
      {name:'June',days:30},
      {name:'July',days:30},
      {name:'August',days:30},
      {name:'September',days:30},
      {name:'October',days:30},
      {name:'November',days:30},
      {name:'December',days:30},    
   
  ];
  availableColors: ChipColor[] = [
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'accent'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'primary'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'}, 
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'accent'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'primary'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'},
    {name: '', color: 'warn'}, 
    {name: '', color: 'primary'},  
    {name: '', color: 'accent'}, 
    {name: '', color: 'warn'}
  ];

  callsupportdialog() {
    console.log("Existing Data");
    let dialog_Ref = this.dialog.open(SupportActionModal, {
      height: '500px',
      width: '1000px',
      disableClose: true,
      //data: item
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
  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }
  call(a)
  {
      alert("clicked"+a);
  }

}
export interface ChipColor {
  name: string;
  color: string;
}
export interface month{
  name:string;
  days:number;
}
