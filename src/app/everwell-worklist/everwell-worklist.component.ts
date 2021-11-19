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
import { LoaderService } from 'app/services/common/loader.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';



@Component({
  selector: 'app-everwell-worklist',
  templateUrl: './everwell-worklist.component.html',
  styleUrls: ['./everwell-worklist.component.css'],
  providers: [ DatePipe ] 
})
export class EverwellWorklistComponent implements OnInit {
  // flags
  showTable = true;  
  showEditForm = false;
  name: any;
  showCalender= false;
  @Output() everwellBeneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitFeedback: EventEmitter<any> = new EventEmitter<any>();

  //Calender
  val: string; date: Date;
  currentmonth: string;
  msg: boolean;
  current: boolean;
  aftermonth: string;
  aftermonth2: string;
  beforemonth: string;
  beforemonth2: string;
  prev: any;

  //Date Array
  dosesDatesList: any =[];

  data: any = [];
  previous: number;
  previousDay: any;
  ar:any=[];
  dateIndex: number;
  feedbackDetails: any;
  showProgressBar: boolean=false;
  srcPath: string;
  fileName: any;
  currentLanguageSet: any;
  benDetailsList: any=[];



  constructor(public dialog: MdDialog, private OCRService: OutboundReAllocationService,
     private _common: dataService, public router: Router,public alertService: ConfirmationDialogsService,
     private _util: RegisterService,private alertMaessage: ConfirmationDialogsService,
     private loaderService: LoaderService,public datepipe:DatePipe,
     private HttpServices:HttpServices
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


    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
     let aDate = new Date();aDate.setDate(aDate.getDate() - 1);
    
     let arr=[];
     for(var i=1;i<=15;i++)
    { aDate = new Date();
     aDate.setDate(aDate.getDate() - i);
     this.ar.push((aDate.getDate())+" "+monthNames[aDate.getMonth()]);
    }
    console.log("ar",this.ar);
    

this.assignSelectedLanguage();
this.listBenDetails();

  }

  listBenDetails() {
    const benDetailsReq = { 
          'providerServiceMapId': this._common.outboundEverwellData.providerServiceMapId,
          'PrimaryNumber': this._common.outboundEverwellData.PrimaryNumber  }
    this.OCRService.benDetailsOnPhnNo(benDetailsReq).subscribe(response=>{
    
      this.benDetailsList = response;
     
    }, err => {
      console.log(err);
      
    })
  }
  
  getEverwellGuidelines(benData)
  {
    let req={
     'adherencePercentage':benData.AdherencePercentage,
     'providerServiceMapID':benData.providerServiceMapId
     
    }
    // let req={};
    // this.fileName="EverwellGuideline";
    this.showProgressBar = true;
    this.loaderService.show();
    this.OCRService.getEverwellGuidelinesDetails(req).subscribe(response => 
      {
      
        if(response.data.length>0)
        {
        
        this.srcPath=response.data[0].fileContent;
        this.fileName=response.data[0].fileName;
        this.showProgressBar = false;
        this.loaderService.hide();
        
        }
        else
        {
          this.showProgressBar = false;
          this.loaderService.hide();
          // this.alertService.alert('Everwell Guideline Data is not available','error');
        }
      
     
      
        
      },
    (err)=> {
      this.showProgressBar = false;
      this.loaderService.hide();
      this.alertService.alert(this.currentLanguageSet.errorInFetchingEverwellGuidelineData,'error');
      console.log('Unable to Fetch Everwell Guideline Data');
    });
  }

  getFeedBackDetails(){
    let req={
       "Id":this.data.Id
      //"Id": 290488
    };
    this.OCRService.getEverwellFeedBackDetails(req).subscribe(response => 
      {
        console.log('Everwell Call FeedBack Data is', response);
        this.feedbackDetails=response.feedbackDetails;
       this._common.previousFeedback=this.feedbackDetails;
        console.log('feedBack', this.feedbackDetails);
      },
    (err)=> {
      this.alertService.alert(err.errorMessage,'error');
      console.log('Everwell error in call FeedBack Data');
    });
  }

checkColorCode(day,param1,param2)
{
 
let d;let result=null;
if(this.feedbackDetails != undefined && this.feedbackDetails != null)
{
  
 for(var i=0;i<this.feedbackDetails.length;i++)
 {
   d=new Date(this.feedbackDetails[i].dateOfAction);
 if(d.getDate()===day)
 {
  if(this.feedbackDetails[i].subCategory==="Dose not taken")
  {
   result="missedDose";
   }
   else if(this.feedbackDetails[i].subCategory==="Dose taken but not reported by technology")
   result="manualDose";
   
   else
   result="restDose";
  }
  }
}
if(result==null)
  result="others";
  if(this.checkcurrentMonthDay(param1,param2))
  return result;
 }

  tableMode() {
    this.showTable = true;
    this.showCalender = false;
    this.showEditForm = false;
  
  }
  editMode(benData:any) {
    let datesList: any;
    if(benData){
      this.getEverwellGuidelines(benData);
      this._common.outboundEverwellData=benData;
      if(this._common.outboundEverwellData.noInfoDosesDates !=undefined && this._common.outboundEverwellData.noInfoDosesDates !=null){
      datesList= this._common.outboundEverwellData.noInfoDosesDates.split('||');
      datesList.forEach(element => {
        element = this.formattingDate(element);
        this.dosesDatesList.push(new Date(element));
      });
    }  
    this.showTable = false;
    this.showEditForm = false;
    this.showCalender = true;
    this.everwellBeneficiarySelected.emit(benData);
    this.data.callID = this._common.callID;
    this.data.is1097 = true;
    //this.data.createdBy = outboundData.everwelldata.createdBy;
    this.data.Id = this._common.outboundEverwellData.Id;
    console.log("ID", this.data);
    this.data.calledServiceID = this._common.outboundEverwellData.providerServiceMapId;
    this.data.PrimaryNumber = this._common.outboundEverwellData.PrimaryNumber;
    this.data.agentID = this._common.outboundEverwellData.agentId;
    this.data.beneficiaryRegId = this._common.outboundEverwellData.beneficiaryRegId;
    this.data.beneficiaryID = this._common.outboundEverwellData.beneficiaryID;
    this.data.FirstName = this._common.outboundEverwellData.FirstName;
    this.data.LastName = this._common.outboundEverwellData.LastName;
    this.data.remarks = this._common.outboundEverwellData.comments;
    this.data.outBoundCallID = this._common.outboundEverwellData.eapiId;
    this.data.state = this._common.outboundEverwellData.State;
    this.data.Gender = this._common.outboundEverwellData.Gender;
    this.data.district = this._common.outboundEverwellData.District;
    this.data.eapiId = this._common.outboundEverwellData.eapiId;
    this.data.comments = this._common.outboundEverwellData.comments;
    this.data.callCounter = this._common.outboundEverwellData.callCounter;
    this.data.lastCall = this._common.outboundEverwellData.lastCall;    
    this.getFeedBackDetails();
    }
  }

  formattingDate(day:any) {
    let stringSplit = day.split('/');
    let date = stringSplit[1];
    let month = stringSplit[0];
    let year = stringSplit[2];
    return date +'/'+ month +'/'+ year;
  }
  getcurrentmonth() {
    // var curmonth = new Date();
    // this.currentmonth = this.daysmonth[curmonth.getMonth()].name;

    // var am = new Date();
    // this.aftermonth = this.daysmonth[((am.getMonth()) + 2)].name;
    // var am1 = new Date();
    // this.aftermonth2 = this.daysmonth[((am1.getMonth()) + 1)].name;

    // var bm = new Date();
    // this.beforemonth = this.daysmonth[((bm.getMonth()) - 2)].name;
    // var bm1 = new Date();
    // this.beforemonth2 = this.daysmonth[((bm1.getMonth()) - 1)].name;
    var curmonth = new Date();
    this.currentmonth = this.daysmonth[curmonth.getMonth()].name;
 
    var am = new Date();
    let monthValue;
    if(((am.getMonth() + 2)) >= 12){
      monthValue = (am.getMonth() + 2) - 12;
    }else{
      monthValue = (am.getMonth() + 2);
    }
    this.aftermonth = this.daysmonth[(monthValue)].name;
    var am1 = new Date();
    let monthValue1;
    if(((am1.getMonth() + 1)) >= 12){
      monthValue1 = (am1.getMonth() + 1) - 12;
    }else{
      monthValue1 = (am1.getMonth() + 1)
    }
    this.aftermonth2 = this.daysmonth[(monthValue1)].name;
 
    var bm = new Date();
    let monthValue2;
    if(((bm.getMonth() - 2)) < 0){
      monthValue2 = (bm.getMonth() -2 ) +12;
    }else{
      monthValue2 = (bm.getMonth() -2 )
    }
    this.beforemonth = this.daysmonth[(monthValue2)].name;
    var bm1 = new Date();
    let monthValue3;
    if(((bm1.getMonth() - 1)) < 0){
      monthValue3 = (bm1.getMonth() - 1) + 12;
    }else{
      monthValue3 = (bm1.getMonth() - 1)
    }
    this.beforemonth2 = this.daysmonth[(monthValue3)].name;

    this.daysmonth = this.daysmonth.filter(
      m => m.name.toString() == this.currentmonth ||
       // m.name.toString() == this.aftermonth ||
        // m.name.toString() == this.aftermonth2 ||
        m.name.toString() == this.beforemonth ||
        m.name.toString() == this.beforemonth2
    );
  }
  pushArray(ar,value)
  {
    let flag=false;
    if(ar!=null && ar.length >0)
    {
      ar.forEach(element => {
        if(element.eapiId==value.eapiId)
        {
          flag=true;
        }
      });
      if(!flag)
      ar.push(value);
      return ar;
    }
    else
    {
      ar.push(value);
      return ar;
    }
  }
  callsupportdialog() {
    var curmonth = new Date();
    curmonth.setDate(curmonth.getDate() - (this.dateIndex+1));
    this.previousDay =curmonth.toLocaleString('en-US',{hour12:false}).split(" ")[0];
    this.previousDay = this.previousDay.substring(0,10);
    this.previousDay= this.datepipe.transform(new Date(this.previousDay), 'MM/dd/yyyy');
    console.log("prevDay",this.previousDay)
    console.log("dateInd", this.dateIndex)
   let dialogRequestObj={
     "srcPath": this.srcPath,
     "fileName":this.fileName,
     "previousDay":this.previousDay
   };

    let dialog_Ref = this.dialog.open(SupportActionModal, {
      height: '550px',
      width: '700px',
      disableClose: true,
      data: dialogRequestObj,
      panelClass: 'headerTitle'
    });
    dialog_Ref.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);\
      this.getFeedBackDetails();
      if(this._common.feedbackData !=undefined && this._common.feedbackData !=null && this._common.feedbackData.length >0)
      {
        let ar:any=[];
        this._common.feedbackData.forEach(val=>{
          if(this.benDetailsList !=undefined && this.benDetailsList !=null && this.benDetailsList.length >0)
          {
            this.benDetailsList.forEach(element => {
              if(element.Id == val.Id)
              ar=this.pushArray(ar,element);
            });
          }
        })
        if(ar !=null && ar.length>0)
        this._common.everwellFeedbackCallData=ar;
      }
      this.submitFeedback.emit(this._common.checkEverwellResponse);
      console.log("result1",result);
      if (result === "success") {
        console.log("result",result);
        
        

      //  this.dialogService.alert("Updated successfully", 'success');
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
  checkcurrentMonthDay(name,days) {

   

    let monthDate=days+" "+name;
    
 let i=0;
 this.dateIndex=0;
    for(i=0;i<this.ar.length;i++)
    {
      if(monthDate == this.ar[i])
      {
       
        this.current = true;
        this.dateIndex=i;
        return true;
      }
    }
    if(i==this.ar.length)
    {
      this.current = false;
      return false;
    }
  }
  

  // checkcurrentMonthDay(name,days) {


  //   this.currentdaysactive(name);
  //   if (this.currentmonth == name && this.previous==days) {

  //      this.range=this.range-1;
  //     this.current = true;
   
  //     return true;
  //   }
  //   else {
  //     this.current = false;
  //     return false;
  //   }
 
  // }



  currentdaysactive(month) {
    // var c = 0; this.date = new Date();
    // this.val = new Date().toDateString();
    // for (var i = 0; i < this.val.length; i++) {
    //   if (this.val.charAt(i) == ' ') {
    //     c++;
    //     if (c == 2) {
    //       var days = this.val.substring(i + 1, i + 3);
    //       break;
    //     }
    //   }
    // }
    var d = new Date();
    this.previous= d.getDate()-2;
    this.prev=d.setDate(d.getDate() - 2);
    
    // var n = d.getDay();
    // this.previous=n-1;
   
    

    
    if(this.previous==0 && (month == 'January' || 'February' || 'April' || ' June'  || 'August' || 'September' || 'November'))
    {
    this.previous=31;
    }

    if(this.previous==0 && (month == 'May' || 'July' || 'October' || 'December')){
    this.previous=30;
    
  }
  let k= (new Date()).getFullYear();
  if(this.previous==0 && month=='March' && (k%4==0)){
    this.previous=29;
  }
    else if(this.previous==0 && month=='March' && (k%4!=0))
    {
    this.previous=28;}
  
    


    
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

    { name: 'January', days: this.daysInThisMonth(0) },
    { name: 'February', days: this.daysInThisMonth(1) },
    { name: 'March', days: this.daysInThisMonth(2)},
    { name: 'April', days: this.daysInThisMonth(3) },
    { name: 'May', days: this.daysInThisMonth(4) },
    { name: 'June', days: this.daysInThisMonth(5) },
    { name: 'July', days: this.daysInThisMonth(6) },
    { name: 'August', days: this.daysInThisMonth(7) },
    { name: 'September', days: this.daysInThisMonth(8) },
    { name: 'October', days: this.daysInThisMonth(9) },
    { name: 'November', days: this.daysInThisMonth(10) },
    { name: 'December', days: this.daysInThisMonth(11) },

  ];
  daysInThisMonth(month) {
    var year = new Date().getFullYear();    
    return new Date(new Date(year,month).getFullYear(), new Date(year,month).getMonth()+1, 0).getDate();
  } 
 
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
    this.data.Id = outboundData.Id;
    console.log("ID", this.data);
    this.data.calledServiceID = outboundData.providerServiceMapId;
    this.data.PrimaryNumber = outboundData.PrimaryNumber;
    this.data.agentID = outboundData.agentId;
    this.data.beneficiaryRegId = outboundData.beneficiaryRegId;
    this.data.beneficiaryID = outboundData.beneficiaryID;
    this.data.FirstName = outboundData.FirstName;
    this.data.LastName = outboundData.LastName;
    this.data.remarks = outboundData.comments;
    this.data.outBoundCallID = outboundData.eapiId;
    this.data.state = outboundData.State;
    this.data.Gender = outboundData.Gender;
    this.data.district = outboundData.District;
    this.data.eapiId = outboundData.eapiId;
    this.data.comments = outboundData.comments;
    this.data.callCounter = outboundData.callCounter;
    this.data.lastCall = outboundData.lastCall;

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
    console.log('primaryNumber'+ this.data.PrimaryNumber);    
  } 
}
setBenCall(response) {
  this._common.callData = response;
}
ngDoCheck() {
  this.assignSelectedLanguage();
}

assignSelectedLanguage() {
  const getLanguageJson = new SetLanguageComponent(this.HttpServices);
  getLanguageJson.setLanguage();
  this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
export interface month {
  name: string;
  days: number;
}
@Component({
  selector: 'SupportActionModal',
  templateUrl: './support.component.html',
  styleUrls: ['./everwell-worklist.component.css'],
  providers: [ DatePipe ] 
})
export class SupportActionModal {
  // arrays  
  
  //subcategries:any=["Dose not taken","Dose taken but not reported by technology","Called & Counselled","Phone not reachable","Phone switched off","Did not receive the call","Others"];  
  subcategries:any=["Dose not taken","Dose taken but not reported by technology","Wrong Phone number","Do not disturb for today","Others"];
  category:any=["Support_Action_Call"];
  comments:any;
  dob: any;
  actionTaken:any=["Call"]
  feedbackData: any = [];
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  isFeedbackData=[];
  addNum: boolean;
  @ViewChild('editAdminCreationForm') editAdminCreationForm: NgForm;
  everwellBenData: any;
  lastDay: any;
  feedbackFlag: any;
  gender: any;

  editcategory:any=["Support_Action_Call"];
  editsubcategries:any=["Dose not taken","Dose taken but not reported by technology","Called & Counselled","Phone not reachable","Phone switched off","Did not receive the call","Others"];  
  editsubcategory:any;
  editactionTaken:any=["Call"];
  editdob: any;
  editcomments:any;
  editaddMblNum:any;
  editmblNum:any;
  enablecontrols: boolean = true;
  dosecolor: string;
  efid: any;
  isfeedbackedit: boolean = false;
  srcPath: string;
  fileName: any;
  showProgressBar: boolean=false;
  currentLanguageSet: any;


 

  constructor(@Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog,private _common: dataService, private _callservice:CallServices,public datepipe:DatePipe,
  private alertMaessage: ConfirmationDialogsService,public dialogRef: MdDialogRef<SupportActionModal>,private OCRService: OutboundReAllocationService,public alertService: ConfirmationDialogsService,
  private HttpServices:HttpServices)
    { }

  ngOnInit() {
    
    //console.log("Initial value", this.data);
    // this.superadminService.getCommonRegistrationData().subscribe(response => this.showGenderOnCondition(response));
    // this.superadminService.getAllQualifications().subscribe(response => this.getEduQualificationSuccessHandler(response));
    // this.superadminService.getAllMaritalStatus().subscribe(response => this.showAllMaritalSuccessHandler(response));
   // this.edit();
   console.log("this._common.everwellCallNotConnected",this._common.everwellCallNotConnected);
   if(this._common.everwellCallNotConnected==="yes")
   {
    this.subcategries=["Phone not reachable","Phone switched off","Did not receive the call","Others"];  
   }
   this.everwellBenData = this._common.outboundEverwellData;
   this.everwellBenData.currentMonthMissedDoses=this._common.outboundEverwellData.CurrentMonthMissedDoses;
   console.log('EverWell Ben Data'+ this.everwellBenData);
   this.dob=this.data.previousDay;

   let dateOfAction = new Date(this.dob); 
   console.log("dateAction", dateOfAction);
   this.lastDay= this.dob;
   this.isfeedbackedit=false;
   let ar=this._common.previousFeedback;
   this.efid = null;
   if(ar!=undefined)
   {
     for(var i=0;i<ar.length;i++)
     {
      let d=new Date(ar[i].dateOfAction);
      console.log("dddd", d);
       if (d.getTime() === dateOfAction.getTime()) {        
         this.editcategory = ar[i].category;
         this.editsubcategries = ar[i].subCategory;
         this.editactionTaken = ar[i].actionTaken;
         this.editdob = this.dob;
         this.editcomments = ar[i].comments;
         this.addNum = ar[i].secondaryPhoneNo == undefined ? false : true;
         this.editaddMblNum = ar[i].secondaryPhoneNo == undefined ? false : true;
         this.editmblNum = ar[i].secondaryPhoneNo == undefined ? "" : ar[i].secondaryPhoneNo;
        
         if (ar[i].efid != undefined && ar[i].efid != null) {
           this.efid = ar[i].efid;
         }

       
         this.isfeedbackedit=true;
       }

     }
  
    
   }
  //  this.isFeedbackData= this._common.feedbackData;
  console.log("checkFeedback",this._common.feedbackData)
  if(this._common.feedbackData){
    this.feedbackData= this._common.feedbackData;
    console.log("this.feedbackData",this.feedbackData)
    
     this.isFeedbackData = this.feedbackData.filter(
      result => result.dateOfAction == this.datepipe.transform(new Date(this.dob), 'yyyy-MM-dd')
      
    );
  }

  this.fileName=this.data.fileName;
  this.srcPath=this.data.srcPath;


  this.assignSelectedLanguage();

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
      this.alertMaessage.alert(this.currentLanguageSet.pleaseSelectBeneficiary, 'error');
      return false;
    }
    const providerObj = {};
    if(this.efid != undefined && this.efid != null){
    providerObj['efid'] = this.efid;
    }
    providerObj['eapiId'] = this._common.outboundEverwellData.eapiId;
    providerObj['Id']=this.everwellBenData.Id;
    providerObj['providerServiceMapId']=this.everwellBenData.providerServiceMapId;
    providerObj['MissedDoses'] = this.everwellBenData.MissedDoses;
    providerObj['currentMonthMissedDoses'] = this.everwellBenData.currentMonthMissedDoses;
    providerObj['category'] = item.category[0];
    providerObj['subCategory'] = item.subcategory;
    providerObj['AdherencePercentage'] = this.everwellBenData.AdherencePercentage;
    providerObj['actionTaken'] = item.actionTaken[0];
    providerObj['comments'] = item.comments;
    providerObj['dateOfAction'] = this.datepipe.transform(new Date(item.dob), 'yyyy-MM-dd');   
    providerObj['secondaryPhoneNo'] = item.mblNum;
    providerObj['createdBy']=this.everwellBenData.createdBy;
    if(providerObj['secondaryPhoneNo']=="" || providerObj['secondaryPhoneNo']==undefined){
      providerObj['secondaryPhoneNo']=null;
    }
    this._callservice.postEverwellFeedback(providerObj).subscribe((response) => {
      console.log("response",response);
      if(response != null && response.savedData != null){
        // this._common.feedbackData = providerObj;
        // this.feedbackData = providerObj;    
        this._common.feedbackData.push(providerObj);
        this._common.checkEverwellResponse = true;
        if(this.efid != undefined && this.efid != null)
        this.alertMaessage.alert(this.currentLanguageSet.feedbackUpdatedSuccessfully, 'success');
        else
        {
        this._common.updatedFeedbackList.push(item.dob);
        this.alertMaessage.alert(this.currentLanguageSet.feedbackSubmittedSuccessfully, 'success');
        }
        this.dialogRef.close();
        console.log(this.currentLanguageSet.feedbackUpdatedSuccessfully, response);
      }
    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('error in submit Feedback');
    });
  }
  updateFeedback(item){
    if(!this._common.outboundEverwellData)
    {
      this.alertMaessage.alert(this.currentLanguageSet.pleaseSelectBeneficiary, 'error');
      return false;
    }
    const providerObj = {};
    // if(this.efid != undefined && this.efid != null){
    // providerObj['efid'] = this.efid;
    // }
  
  

      if (this._common.updatedFeedbackList.some((updatedItem) => updatedItem === item.editdob)) {
        providerObj['efid'] = this.efid;
 
      }

    providerObj['eapiId'] = this._common.outboundEverwellData.eapiId;
    providerObj['Id']=this.everwellBenData.Id;
    providerObj['providerServiceMapId']=this.everwellBenData.providerServiceMapId;
    providerObj['MissedDoses'] = this.everwellBenData.MissedDoses;
    providerObj['currentMonthMissedDoses'] = this.everwellBenData.currentMonthMissedDoses;
    providerObj['category'] = item.editcategory;
    providerObj['subCategory'] = item.editsubcategries;
    providerObj['AdherencePercentage'] = this.everwellBenData.AdherencePercentage;
    providerObj['actionTaken'] = item.editactionTaken;
    providerObj['comments'] = item.editcomments;
    providerObj['dateOfAction'] = this.datepipe.transform(new Date(item.editdob), 'yyyy-MM-dd');   
    providerObj['secondaryPhoneNo'] = item.mblNum;
    providerObj['createdBy']=this.everwellBenData.createdBy;
    if(providerObj['secondaryPhoneNo']=="" || providerObj['secondaryPhoneNo']==undefined){
      providerObj['secondaryPhoneNo']=null;
    }
    this._callservice.postEverwellFeedback(providerObj).subscribe((response) => {
      console.log("response",response);
      if(response != null && response.savedData != null){        
        this._common.feedbackData.push(providerObj);
        this._common.checkEverwellResponse = true;

        if (!this._common.updatedFeedbackList.some((updatedListItem) => updatedListItem == item.editdob)) {
          this._common.updatedFeedbackList.push(item.editdob);
        }
        this.alertMaessage.alert(this.currentLanguageSet.feedbackUpdatedSuccessfully, 'success');
        this.dialogRef.close();
        console.log(this.currentLanguageSet.feedbackUpdatedSuccessfully, response);
      }
    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('error in submit Feedback');
    });
  }


  closeModal() {
   this.isFeedbackData=[];

    this.dialogRef.close(false);
  }
  addNumber(status) {
    if (status.checked) {
      this.addNum = true;
    } else {
      this.addNum = false;
    }
  }
  enableControls(){    
    this.enablecontrols = !this.enablecontrols;
    this.dosecolor= this.enablecontrols?"":"dosecolor";
  }

  // getEverwellGuidelines()
  // {
  //   let req={
  //    'adherencePercentage':this._common.outboundEverwellData.AdherencePercentage,
  //    'providerServiceMapID':this._common.outboundEverwellData.providerServiceMapId
     
  //   }
  //   // let req={};
  //   // this.fileName="EverwellGuideline";
  //   this.showProgressBar = true;
  //   this.OCRService.getEverwellGuidelinesDetails(req).subscribe(response => 
  //     {
      
  //       if(response.data.length>0)
  //       {
        
  //         this.srcPath=response.data[0].fileContent;
  //       this.fileName=response.data[0].fileName;
  //       this.showProgressBar = false;
        
  //       }
  //       else
  //       {
  //         this.showProgressBar = false;
  //         this.alertService.alert('Everwell Guideline Data is not available','error');
  //       }
      
     
      
        
  //     },
  //   (err)=> {
  //     this.showProgressBar = false;
  //     this.alertService.alert('Error in Fetching Everwell Guideline Data','error');
  //     console.log('Unable to Fetch Everwell Guideline Data');
  //   });
  // }

  openPDFGuidelines()
  { 
 
  let srcFilePath=this.srcPath.replace('data:application/pdf;base64,','');
  
    var byteCharacters = atob(srcFilePath);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: 'application/pdf;base64' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    return false;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
 
}
