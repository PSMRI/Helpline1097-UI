import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-notifications',
  templateUrl: './edit-notifications.component.html',
  styleUrls: ['./edit-notifications.component.css']
})
export class EditNotificationsComponent implements OnInit {
  providerServiceMapID: any;
  createdBy: any;
  userId: any;
  maxFileSize = 5;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  file : any;
  fileContent : any;
  validTill : Date;
  validFrom : Date;
  postData: any;
  @ViewChild('editNotificationForm') editNotificationForm :  NgForm;
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<EditNotificationsComponent>, private commonDataService : dataService) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    console.log(this.data);
    this.validTill = new Date(this.data.validTill);
    this.validFrom = new Date(this.data.validFrom);
  }

  onFileUpload(event){
    this.fileList = event.target.files;
    this.file = event.target.files[0];
    if(this.file){
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }
    if(this.fileList.length==0){
      this.error1 = true;
      this.error2 = false;
    }
    else if(this.fileList.length > 0 && this.fileList[0].size/1000/1000 <=this.maxFileSize){
      console.log(this.fileList[0].size/1000/1000);
      this.error1 = false;
      this.error2 = false;
    }
    else if(this.fileList[0].size/1000/1000 >this.maxFileSize){
      console.log(this.fileList[0].size/1000/1000);
      this.error2 = true;
      this.error1 = false;
    }
  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  onSubmit(){
    console.log(this.editNotificationForm.value);
    console.log(this.data);
    if(this.file && this.fileContent){
    this.postData = {
              "providerServiceMapID": this.providerServiceMapID,
              "notificationTypeID": this.data.notificationTypeID,
              "notificationID": this.data.notificationID,
              "roleID": this.commonDataService.current_role.RoleID,
              "createdBy": this.data.notificationType.createdBy,
              "notification": this.editNotificationForm.value.notificationSubject,
              "notificationDesc": this.editNotificationForm.value.notificationDesc,
              "validFrom": new Date((this.editNotificationForm.value.startDate) - 1 * (this.editNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
              "validTill": new Date((this.editNotificationForm.value.endDate) - 1 * (this.editNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
              "deleted": this.data.notificationType.deleted,
              "modifiedBy": this.createdBy,
              "kmFileManager": {
                "fileName": this.file.name, 
                "fileExtension": '.' + this.file.name.split('.')[1], 
                "providerServiceMapID": this.providerServiceMapID, 
                "userID": this.userId, 
                "validFrom": new Date((this.editNotificationForm.value.startDate) - 1 * (this.editNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON(), 
                "validUpto": new Date((this.editNotificationForm.value.endDate) - 1 * (this.editNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON(), 
                "fileContent":this.fileContent.split(',')[1], 
                "createdBy":this.createdBy
              }
          };
    }
    else {
      this.postData = {
              "providerServiceMapID": this.providerServiceMapID,
              "notificationTypeID": this.data.notificationTypeID,
              "notificationID": this.data.notificationID,
              "roleID": this.commonDataService.current_role.RoleID,
              "createdBy": this.data.notificationType.createdBy,
              "notification": this.editNotificationForm.value.notificationSubject,
              "notificationDesc": this.editNotificationForm.value.notificationDesc,
              "validFrom": new Date((this.editNotificationForm.value.startDate) - 1 * (this.editNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
              "validTill": new Date((this.editNotificationForm.value.endDate) - 1 * (this.editNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
              "deleted": this.data.notificationType.deleted,
              "modifiedBy": this.createdBy
      }
    }
    this.dialogRef.close(this.postData);
  }
}
