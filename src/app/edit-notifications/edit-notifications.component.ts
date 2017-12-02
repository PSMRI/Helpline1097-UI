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
  file: any;
  fileContent: any;
  validTill: Date;
  validFrom: Date;
  postData: any;

  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg','jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  invalid_file_flag: boolean = false;

  @ViewChild('editNotificationForm') editNotificationForm: NgForm;
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef < EditNotificationsComponent > , private commonDataService: dataService) {}

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    console.log(this.data);
    this.validTill = new Date(this.data.validTill);
    this.validFrom = new Date(this.data.validFrom);
  }

  onFileUpload(event) {

    this.fileList = event.target.files;
    this.file = event.target.files[0];

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
      this.invalid_file_flag = false;
    } else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = false;
      this.error2 = false;
    } else if (this.fileList[0].size / 1000 / 1000 > this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error2 = true;
      this.error1 = false;
    }
  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  checkExtension(file) {
    var count = 0;
    console.log("FILE DETAILS", file);
    if (file) {
      var array_after_split=file.name.split(".");
    var file_extension=array_after_split[array_after_split.length-1];
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
    console.log(this.editNotificationForm.value);
    console.log(this.data);
    let startDate: Date = new Date(this.editNotificationForm.value.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    // startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);

    let endDate: Date = new Date(this.editNotificationForm.value.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);
    // endDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000);
    if (this.file && this.fileContent) {
      this.postData = {
        "providerServiceMapID": this.providerServiceMapID,
        "notificationTypeID": this.data.notificationTypeID,
        "notificationID": this.data.notificationID,
        "roleID": this.data.roleID,
        "createdBy": this.data.notificationType.createdBy,
        "notification": this.editNotificationForm.value.notificationSubject,
        "notificationDesc": this.editNotificationForm.value.notificationDesc,
        "validFrom": startDate,
        "validTill": endDate,
        // "deleted": this.data.notificationType.deleted,
        "modifiedBy": this.createdBy,
        "kmFileManager": {
          "fileName": this.file.name,
          "fileExtension": '.' + this.file.name.split('.')[1],
          "providerServiceMapID": this.providerServiceMapID,
          "userID": this.userId,
          "validFrom": startDate,
          "validUpto": endDate,
          "fileContent": this.fileContent.split(',')[1],
          "createdBy": this.createdBy
        }
      };
    } else {
      this.postData = {
        "providerServiceMapID": this.providerServiceMapID,
        "notificationTypeID": this.data.notificationTypeID,
        "notificationID": this.data.notificationID,
        "roleID": this.data.roleID,
        "createdBy": this.data.notificationType.createdBy,
        "notification": this.editNotificationForm.value.notificationSubject,
        "notificationDesc": this.editNotificationForm.value.notificationDesc,
        "validFrom": startDate,
        "validTill": endDate,
        "deleted": this.data.notificationType.deleted,
        "modifiedBy": this.createdBy
      }
    }
    this.dialogRef.close(this.postData);
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
}
