import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';


@Component({
  selector: 'app-supervisor-notifications',
  templateUrl: './supervisor-notifications.component.html',
  styleUrls: ['./supervisor-notifications.component.css']
})
export class SupervisorNotificationsComponent implements OnInit {

  notificationTypes = [];
  selectedNotification : any;
  roleObjArray = [];
  providerServiceMapID: any;
  maxFileSize = 5;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  createdBy: any;
  requiredArr = [];
  @ViewChild('notificationForm') notificationForm: NgForm;
  
  constructor(private notificationService: NotificationService,public commonDataService: dataService) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.notificationTypes = response.data;
    },
    (error)=>{
      console.log(error);
    });
    this.notificationService.getRoles(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.roleObjArray = response.data;
    },
    (error)=>{
      console.log(error);
    });
  }

  onFileUpload(event){
    this.fileList = event.target.files;
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

  onSubmit(){
    console.log(this.notificationForm.value);
    const promise = new Promise((resolve, reject)=>{
      for(var i= 0 ; i< this.notificationForm.value.roles.length;i++){
        var data = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.selectedNotification.notificationTypeID,
          "roleID": this.notificationForm.value.roles[i],
          "createdBy": this.createdBy,
          "notificationDesc": this.notificationForm.value.notificationMessage,
          "validFrom": new Date((this.notificationForm.value.startDate) - 1 * (this.notificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
          "validTill": new Date((this.notificationForm.value.endDate) - 1 * (this.notificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON()
        }
        this.requiredArr.push(data);
        if(i==(this.notificationForm.value.roles.length-1)){
          resolve(this.requiredArr);
        }
      }
    })
    .then(
      (data) => { 
        console.log(data);
        this.notificationService.createNotification(data)
        .subscribe((response)=>{
          console.log(response);
        },
        (error)=> {
          console.log(error);
        })
      },
      (err) => { console.log(err); }
    );
    
  }
  onChangeNotificationType(event){
    console.log(this.notificationTypes[event.value]);
    this.selectedNotification = this.notificationTypes[event.value];
  }
  
}
