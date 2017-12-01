import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.css']
})
export class NotificationsDialogComponent implements OnInit {

  notificationTypes = [];
  roleObjArray = [];
  providerServiceMapID: any;
  maxFileSize = 5;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;
  createdBy: any;
  requiredArr = [];
  userId: any;
  file: any;
  fileContent: any;

  serviceID:any;
  stateID:any;
  serviceProviderID:any;
   request_array:any=[];

     visibility_Flag:boolean=true;

sDate:Date=new Date();
  eDate:Date=new Date();

  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg','jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  invalid_file_flag: boolean = false;

  minDate: Date;
  @ViewChild('notificationForm') notificationForm: NgForm;

  constructor(private notificationService: NotificationService, public commonDataService: dataService, public dialog: MdDialog, @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NotificationsDialogComponent>) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.minDate = new Date();
    this.minDate.setHours(0);
    // this.mindate.toJSON();
    // // this.mindate.toISOString();

    this.notificationService.getServiceProviderID(this.providerServiceMapID).subscribe(response=>this.getProviderIDSuccess(response));


  }

  getProviderIDSuccess(response)
  {
    this.serviceProviderID=response.serviceProviderID;
    console.log(this.serviceProviderID,"SP_ID");
    this.serviceID=response.serviceID;
    this.stateID=response.stateID;
    // invoke these all
    this.getAllLanguages();
    this.getOffices(this.serviceProviderID,this.stateID,this.serviceID);
    this.getUsers(this.providerServiceMapID);
  }

  getAllLanguages()
  {
    this.notificationService.getLanguages().subscribe(response=>this.getLanguageSuccessHandeler(response));
  }

  languages:any=[];
  users:any=[];
  offices:any=[];
  getLanguageSuccessHandeler(response)
  {
    console.log(response,"Languages");
    this.languages=response;

  }

  getOffices(providerID,stateID,serviceID)
  {
    this.notificationService.getOffices(providerID,stateID,serviceID).subscribe(response=>this.getOfficesSuccessHandeler(response));
  }

  getOfficesSuccessHandeler(response)
  {
    console.log(response,"offices");
    this.offices=response;
  }

  getUsers(psmID)
  {
    this.notificationService.getUsersByProviderID(psmID).subscribe(response=>this.getUsersSuccessHandeler(response));
  }

  getUsersSuccessHandeler(response)
  {
    console.log(response,"users");
    this.users=response;
  }


  show:any=0;
  checkNotificationType(notification_type)
  {
    if(notification_type.toUpperCase()==="Language Message".toUpperCase())
    {
      this.show=1;
      this.visibility_Flag=true;
    }
    else if(notification_type.toUpperCase()==="User Message".toUpperCase()||notification_type.toUpperCase()==="User Ratings".toUpperCase())
    {
      this.show=2;
      this.visibility_Flag=true;
    }
    else if(notification_type.toUpperCase()==="Location Message".toUpperCase())
    {
      this.show=3;
      this.visibility_Flag=true;
    }
    else if(notification_type.toUpperCase()==="Emergency Contact".toUpperCase())
    {
      let today=new Date();
      let future_day: Date;

      this.visibility_Flag=false;
      this.show=-1;

      future_day = new Date(today);
      future_day.setFullYear(today.getFullYear() + 10,today.getMonth(),today.getDate());

      console.log("sDate:",today,"edate:",future_day);
      this.sDate=new Date();
      this.eDate=future_day;

      this.notificationForm.value.startDate=this.sDate;
      this.notificationForm.value.endDate=this.eDate;

    }
    else
    {
      this.show=0;
      this.visibility_Flag=true;
    }
  }

  onFileUpload(event) {
    this.fileList = event.target.files;
    this.file = event.target.files[0];
    console.log(this.file);

     var validFormat = this.checkExtension(this.file);
    if (validFormat) {
      this.invalid_file_flag = false;
    } else {
      this.invalid_file_flag = true;
    }


    if (this.file) {
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }
    if (this.fileList.length == 0) {
      this.error1 = true;
      this.error2 = false;
      this.error3 = false;
    }
    else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = false;
      this.error2 = false;
      this.error3 = false;
    }
    else if (this.fileList[0].size / 1000 / 1000 == 0) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error2 = false;
      this.error1 = false;
      this.error3 = true
    }
    else if (this.fileList[0].size / 1000 / 1000 > this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error2 = true;
      this.error1 = false;
      this.error3 = false;
    }

  }

  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  checkExtension(file) {
    var count = 0;
    console.log("FILE DETAILS", file);
    if (file) {
      var file_extension = file.name.split(".")[1];
      for (let i = 0; i < this.valid_file_extensions.length; i++) {
        if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
          count = count + 1;
        }
      }

      if (count > 0) {
        return true;
      } else {
        return false;
      }
    }
    else
    {
      return true;
    }
  }

  onSubmit() {
    console.log(this.notificationForm.value);
    if(this.show===-1)
    {
      let today=new Date();
      let future_day: Date;

      future_day = new Date(today);
      future_day.setFullYear(today.getFullYear() + 10,today.getMonth(),today.getDate());

      console.log("sDate:",today,"edate:",future_day);
      this.sDate=new Date();
      this.eDate=future_day;

      this.notificationForm.value.startDate=this.sDate;
      this.notificationForm.value.endDate=this.eDate;

    }
    let startDate: Date = new Date(this.notificationForm.value.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    // startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);

    let endDate: Date = new Date(this.notificationForm.value.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);
    // endDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000);


    /*const promise = new Promise((resolve, reject) => {
      if (this.notificationForm.value.roles == "") {
        var postData = [{
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.notificationForm.value.notificationType,
          "roleID": undefined,
          "createdBy": this.createdBy,
          "notification": this.notificationForm.value.notificationSubject,
          "notificationDesc": this.notificationForm.value.notificationMessage,
          "validFrom": startDate,
          "validTill": endDate
        }];
        if (this.file != undefined) {
          postData[0]['kmFileManager'] = {
            "fileName": (this.file != undefined) ? this.file.name : '',
            "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
            "providerServiceMapID": this.providerServiceMapID,
            "userID": this.userId,
            "validFrom": startDate,
            "validUpto": endDate,
            "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
            "createdBy": this.createdBy
          };
        }
        resolve(postData);
      }
      for (var i = 0; i < this.notificationForm.value.roles.length; i++) {
        var data = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.notificationForm.value.notificationType,
          "roleID": this.notificationForm.value.roles[i],
          "createdBy": this.createdBy,
          "notification": this.notificationForm.value.notificationSubject,
          "notificationDesc": this.notificationForm.value.notificationMessage,
          "validFrom": startDate,
          "validTill": endDate
        }
        if (this.file != undefined) {
          data['kmFileManager'] = {
            "fileName": (this.file != undefined) ? this.file.name : '',
            "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
            "providerServiceMapID": this.providerServiceMapID,
            "userID": this.userId,
            "validFrom": startDate,
            "validUpto": endDate,
            "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
            "createdBy": this.createdBy
          };
        }
        this.requiredArr.push(data);
        if (i == (this.notificationForm.value.roles.length - 1)) {
          resolve(this.requiredArr);
        }
      }
    })
      .then(
      (data) => {
        console.log(JSON.stringify(data));
        this.dialogRef.close(data);
      },
      (err) => { console.log(err); }
      );*/

      this.request_array=[];

      let kmFileManager = undefined;
      if(this.file!=undefined)
      {
        kmFileManager={
          "fileName": (this.file != undefined) ? this.file.name : '',
          "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
          "providerServiceMapID": this.providerServiceMapID,
          "userID": this.userId,
          "validFrom": startDate,
          "validUpto": endDate,
          "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
          "createdBy": this.createdBy
        }
      }

      let defaultObj={
            "providerServiceMapID": this.providerServiceMapID,
            "notificationTypeID": this.notificationForm.value.notificationType,
            "createdBy": this.createdBy,
            "notification": this.notificationForm.value.notificationSubject,
            "notificationDesc": this.notificationForm.value.notificationMessage,
            "validFrom": startDate,
            "validTill": endDate,
            "kmFileManager":kmFileManager
          }

      let roleIDs=undefined;
      if(this.show===0)
      {
        roleIDs=(this.notificationForm.value.roles == "") ? roleIDs : this.notificationForm.value.roles;
        if(roleIDs===undefined)
        {
          var obj = Object.assign({},defaultObj);
          obj['roleID']=roleIDs;
          // obj={
          //   "providerServiceMapID": this.providerServiceMapID,
          //   "notificationTypeID": this.notificationForm.value.notificationType,
          //   "roleID": roleIDs,
          //   "createdBy": this.createdBy,
          //   "notification": this.notificationForm.value.notificationSubject,
          //   "notificationDesc": this.notificationForm.value.notificationMessage,
          //   "validFrom": startDate,
          //   "validTill": endDate,
          //   "kmFileManager":kmFileManager
          // }
          // if(this.file!=undefined)
          // {
          //   obj['kmFileManager']={
          //     "fileName": (this.file != undefined) ? this.file.name : '',
          //     "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
          //     "providerServiceMapID": this.providerServiceMapID,
          //     "userID": this.userId,
          //     "validFrom": startDate,
          //     "validUpto": endDate,
          //     "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
          //     "createdBy": this.createdBy
          //   }
          // }
          this.request_array.push(obj);
        }
        
        if(roleIDs.length>0)
        {
          
          for (var i = 0; i < roleIDs.length; i++)
          {
            var obj = Object.assign({},defaultObj);
            obj['roleID']=roleIDs[i];
            // obj={
            //   "providerServiceMapID": this.providerServiceMapID,
            //   "notificationTypeID": this.notificationForm.value.notificationType,
            //   "roleID": roleIDs[i],
            //   "createdBy": this.createdBy,
            //   "notification": this.notificationForm.value.notificationSubject,
            //   "notificationDesc": this.notificationForm.value.notificationMessage,
            //   "validFrom": startDate,
            //   "validTill": endDate,
            //   "kmFileManager": kmFileManager
            // }

            // if(this.file!=undefined)
            // {
            //   obj['kmFileManager']={
            //     "fileName": (this.file != undefined) ? this.file.name : '',
            //     "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
            //     "providerServiceMapID": this.providerServiceMapID,
            //     "userID": this.userId,
            //     "validFrom": startDate,
            //     "validUpto": endDate,
            //     "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
            //     "createdBy": this.createdBy
            //   }
            // }
            this.request_array.push(obj);
          }
        }
      }

       if(this.show===-1)
      {
        roleIDs=undefined;
         if(roleIDs===undefined)
        {
          var obj = Object.assign({},defaultObj);
          obj['roleID']=roleIDs;
          this.request_array.push(obj);
        }
      }

      let languageIDs=undefined;
      if(this.show===1)
      {
        languageIDs=(this.notificationForm.value.Languages == "") ? languageIDs : this.notificationForm.value.Languages;

        if(languageIDs===undefined)
        {
          var obj = Object.assign({},defaultObj);
          obj['languageID']=languageIDs;
          
          this.request_array.push(obj);
        }
        
        if(languageIDs.length>0)
        {
         
          for (var i = 0; i < languageIDs.length; i++)
          {
            var obj = Object.assign({},defaultObj);
            obj['languageID']=languageIDs[i];
            
            this.request_array.push(obj);
          }
        }
      }

      let workingLocationIDs=undefined;
      if(this.show===3)
      {
        workingLocationIDs=(this.notificationForm.value.Offices == "") ? workingLocationIDs : this.notificationForm.value.Offices;

        if(workingLocationIDs===undefined)
        {
          var obj = Object.assign({},defaultObj);
          obj['workingLocationID']=workingLocationIDs;
          
          this.request_array.push(obj);
        }
        
        if(workingLocationIDs.length>0)
        {
          for (var i = 0; i < workingLocationIDs.length; i++)
          {
            var obj = Object.assign({},defaultObj);
            obj['workingLocationID']=workingLocationIDs[i];
            
            this.request_array.push(obj);
          }
        }
      }

      let userIDs=undefined;
      if(this.show===2)
      {
        userIDs=[(this.notificationForm.value.Users == "") ? userIDs : this.notificationForm.value.Users];

        if(userIDs===undefined)
        {
          var obj = Object.assign({},defaultObj);
          obj['userID']=userIDs;
          
          this.request_array.push(obj);
        }
        
        if(userIDs.length>0)
        {
         
          for (var i = 0; i < userIDs.length; i++)
          {
            var obj = Object.assign({},defaultObj);
            obj['userID']=userIDs[i];
            
            this.request_array.push(obj);
          }
        }
      }


      console.log("request array",this.request_array);
      this.dialogRef.close(this.request_array);


    }

    blockey(e: any) {
      if (e.keyCode === 9) {
        return true;
      } else {
        return false;
      }
    }


  }
