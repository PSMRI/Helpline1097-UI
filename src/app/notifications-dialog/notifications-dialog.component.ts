import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog,MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

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
  userId : any;
  file : any;
  fileContent : any;

  minDate: Date;
  @ViewChild('notificationForm') notificationForm: NgForm;
  
  constructor(private notificationService: NotificationService,public commonDataService: dataService, public dialog : MdDialog,@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NotificationsDialogComponent>) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate()-1);
  // this.mindate.toJSON();
  // // this.mindate.toISOString();

  }

  onFileUpload(event){
    this.fileList = event.target.files;
    this.file = event.target.files[0];
    console.log(this.file);
    if(this.file){
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }
    if(this.fileList.length==0){
      this.error1 = true;
      this.error2 = false;
      this.error3 = false;
    }
    else if(this.fileList.length > 0 && this.fileList[0].size/1000/1000 <=this.maxFileSize){
      console.log(this.fileList[0].size/1000/1000);
      this.error1 = false;
      this.error2 = false;
      this.error3 = false;
    }
    else if(this.fileList[0].size/1000/1000 == 0){
      console.log(this.fileList[0].size/1000/1000);
      this.error2 = false;
      this.error1 = false;
      this.error3 = true
    }
    else if(this.fileList[0].size/1000/1000 >this.maxFileSize){
      console.log(this.fileList[0].size/1000/1000);
      this.error2 = true;
      this.error1 = false;
      this.error3 = false;
    }

  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  onSubmit(){
    console.log(this.notificationForm.value);
    const promise = new Promise((resolve, reject)=>{
       if(this.notificationForm.value.roles == ""){
          var postData = [{
              "providerServiceMapID": this.providerServiceMapID,
              "notificationTypeID": this.notificationForm.value.notificationType,
              "roleID": undefined,
              "createdBy": this.createdBy,
              "notification": this.notificationForm.value.notificationSubject,
              "notificationDesc": this.notificationForm.value.notificationMessage,
              "validFrom": new Date((this.notificationForm.value.startDate) - 1 * (this.notificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z",
              "validTill": new Date((this.notificationForm.value.endDate) - 1 * (this.notificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z"
          }];
          if(this.file!=undefined){
            data[0]['kmFileManager'] = {
              "fileName": (this.file!=undefined)? this.file.name : '', 
              "fileExtension": (this.file!=undefined)? '.' + this.file.name.split('.')[1]: '', 
              "providerServiceMapID": this.providerServiceMapID, 
              "userID": this.userId, 
              "validFrom": new Date((this.notificationForm.value.startDate) - 1 * (this.notificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z", 
              "validUpto": new Date((this.notificationForm.value.endDate) - 1 * (this.notificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z", 
              "fileContent":(this.fileContent!=undefined)?this.fileContent.split(',')[1]: '', 
              "createdBy":this.createdBy
            };
          }
          resolve(postData);
      }
      for(var i= 0 ; i< this.notificationForm.value.roles.length;i++){
        var data = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.notificationForm.value.notificationType,
          "roleID": this.notificationForm.value.roles[i],
          "createdBy": this.createdBy,
          "notification": this.notificationForm.value.notificationSubject,
          "notificationDesc": this.notificationForm.value.notificationMessage,
          "validFrom": new Date((this.notificationForm.value.startDate) - 1 * (this.notificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z",
          "validTill": new Date((this.notificationForm.value.endDate) - 1 * (this.notificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z"
        }
        if(this.file!=undefined){
          data['kmFileManager'] = {
            "fileName": (this.file!=undefined)? this.file.name : '', 
            "fileExtension": (this.file!=undefined)? '.' + this.file.name.split('.')[1]: '', 
            "providerServiceMapID": this.providerServiceMapID, 
            "userID": this.userId, 
            "validFrom": new Date((this.notificationForm.value.startDate) - 1 * (this.notificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z", 
            "validUpto": new Date((this.notificationForm.value.endDate) - 1 * (this.notificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z", 
            "fileContent":(this.fileContent!=undefined)?this.fileContent.split(',')[1]: '', 
            "createdBy":this.createdBy
          };
        }
        this.requiredArr.push(data);
        if(i==(this.notificationForm.value.roles.length-1)){
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
    );
    
  }


}
