import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';


@Component({
  selector: 'app-supervisor-training-resources',
  templateUrl: './supervisor-training-resources.component.html',
  styleUrls: ['./supervisor-training-resources.component.css']
})
export class SupervisorTrainingResourcesComponent implements OnInit, DoCheck {

  // ngModels
  role: any;
  subject: any;
  startDate: any;
  endDate: any;
  message: any;


  notification_subject: any;
  uploaded_file: any;
  description: any;

  // flags
  showTable = true;
  showForm = false;
  showEditForm = false;
  invalid_file_flag = false;
  error1 = false;
  error2 = false;

  // variables
  providerServiceMapID: any;
  notificationTypeID: any;
  minStartDate: any;
  count: any;
  count2: any;
  maxFileSize: any = 5;
  fileList: FileList;
  file: any;
  fileContent: any;

  createdBy: any;
  userId: any;

  toBeEditedObject: any;

  request_array: any = [];
  km_related_data: any = [];

  // arrays
  roles: any = [];
  allRoleIDs: any = [];
  trainingResources: any = [];
  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];

  currentDate: Date = new Date();

  @ViewChild('trainingResources') trainingResourceForm: NgForm;
  @ViewChild('trainingResourcesEditForm') trainingResourceEditForm: NgForm;
  currentLanguageSet: any;



  constructor(private saved_data: dataService,
    private notificationService: NotificationService,
    public dialogService: ConfirmationDialogsService,
    private httpServices:HttpServices) { }



  ngOnInit() {
    this.minStartDate = new Date();

    this.startDate = new Date();
    this.startDate.setHours(0, 0, 0, 0);

    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 7);
    this.endDate.setHours(23, 59, 59, 0);

    this.createdBy = this.saved_data.Userdata.userName;
    this.userId = this.saved_data.uid;

    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => { this.notificationTypeSuccess(response) },
      (error) => {
        console.log(error);
      });

    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);
    this.currentDate.setMilliseconds(0);
    this.assignSelectedLanguage();
  }

  go2table() {
    this.showTable = true;
    this.showEditForm = false;
    this.showForm = false;
  }

  go2form() {
    this.showTable = false;
    this.showEditForm = false;
    this.showForm = true;
  }

  getAllRoles(providerServiceMapID) {
    this.notificationService.getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        if (response.data.length !== 0) {
          this.roles = response.data.filter(item => {
            return item.featureName.length != 0;
          });
          for (var i = 0; i < this.roles.length; i++) {
            this.allRoleIDs.push(this.roles[i].roleID);
          }

          // function call to gte the TRAINING RESOURCES
          this.getTrainingResources();
        }
        else {
          this.dialogService.alert('No roles found');
        }

      },
      (error) => {
        console.log(error);
      });
  }

  createTrainingResource(form_values) {
    console.log(form_values, 'ON SUBMIT');
    // let startDate: Date = new Date(form_values.startDate);
    const startDate: Date = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    // let endDate: Date = new Date(form_values.endDate);
    const endDate: Date = new Date();
    endDate.setFullYear(endDate.getFullYear() + 20);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    this.request_array = [];

    let kmFileManager = undefined;
    if (this.file !== undefined) {
      kmFileManager = {
        'fileName': (this.file !== undefined) ? this.file.name : '',
        'fileExtension': (this.file !== undefined) ? '.' + this.file.name.split('.')[1] : '',
        'providerServiceMapID': this.providerServiceMapID,
        'userID': this.userId,
        'validFrom': startDate,
        'validUpto': endDate,
        'fileContent': (this.fileContent !== undefined) ? this.fileContent.split(',')[1] : '',
        'createdBy': this.createdBy
      }
    }

    let defaultObj = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': this.notificationTypeID,
      'createdBy': this.createdBy,
      'notification': form_values.subject,
      'notificationDesc': form_values.message,
      'validFrom': startDate,
      'validTill': endDate,
      'kmFileManager': kmFileManager
    };



    let roleIDs = (form_values.roles === undefined ||
      form_values.roles == null ||
      form_values.roles === '' ||
      form_values.roles.length === 0) ? undefined : form_values.roles;

    if (roleIDs === undefined) {
      const obj = Object.assign({}, defaultObj);
      obj['roleID'] = roleIDs;
      this.request_array.push(obj);
    }

    if (roleIDs.length > 0) {
      for (var i = 0; i < roleIDs.length; i++) {
        var obj = Object.assign({}, defaultObj);
        obj['roleID'] = roleIDs[i];
        this.request_array.push(obj);
      }
    }

    let roomArray = [];

    if (roleIDs.length > 0) {
      for (var i = 0; i < roleIDs.length; i++) {
        let filteredRoleObj = this.roles.filter((item) => {
          return item.roleID == roleIDs[i];
        })
        roomArray.push(filteredRoleObj[0].roleName);
      }
    }

    this.notificationService.createNotification(this.request_array)
      .subscribe((response) => this.createTrainingResourceSuccessHandeler(response, form_values, roomArray, startDate),
      (error) => this.trainingResourceErrorHandeler(error));


  }

  createTrainingResourceSuccessHandeler(response, values, roomArray, startDate) {
    console.log(response);
    if (response) {
      this.dialogService.alert(this.currentLanguageSet.trainingResourceCreatedSuccessfully, 'success');
      this.trainingResourceForm.reset();
      this.count = '0/300';

      this.getTrainingResources(); // refreshing the table
      if (startDate.getTime() <= this.currentDate.getTime()) {
        this.notificationService.sendSocketNotification({
          "room": roomArray, type: "Training_Resource", "message": values.message, "subject": values.subject
        })
          .subscribe((response) => {
            console.log(response.data);
          },
          (error) => {
            console.log(error);
          });
      }
    }
  }

  trainingResourceErrorHandeler(error) {
    console.log(error);
    this.dialogService.alert(error.json().errorMessage, 'alert');
  }



  notificationTypeSuccess(res) {
    if (res.data.length > 0) {
      this.km_related_data = res.data.filter(function (obj) {
        if (obj.notificationType.toUpperCase() === 'KM') {
          return obj.notificationTypeID;
        }
      });
    }
    console.log(this.km_related_data, 'notificationTypeID');
    this.notificationTypeID = this.km_related_data[0].notificationTypeID;

    // function call to get All Roles
    this.getAllRoles(this.providerServiceMapID);
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  updateCount() {
    this.count = this.message.length + '/300';
  }
  updateCount2() {
    this.count2 = this.description.length + '/300';
  }

  onFileUpload(event) {
    this.fileList = event.target.files;
    this.file = event.target.files[0];
    console.log(this.file);

    const validFormat = this.checkExtension(this.file);
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
    else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = false;
      this.error2 = false;
    }
    else if (this.fileList[0].size / 1000 / 1000 === 0) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = false;
      this.error2 = true
    }
    else if (this.fileList[0].size / 1000 / 1000 > this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = true;
      this.error2 = false;
    }
  }

  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  checkExtension(file) {
    let count = 0;
    console.log('FILE DETAILS', file);
    if (file) {
      let array_after_split = file.name.split('.');
      let file_extension = array_after_split[array_after_split.length - 1];
      for (let i = 0; i < this.valid_file_extensions.length; i++) {
        if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
          count = count + 1;
        }
      }
      if (count > 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  getTrainingResources() {
    const startDate: Date = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0)

    const endDate: Date = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    const obj = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': this.notificationTypeID,
      'roleIDs': this.allRoleIDs,
      'validStartDate': startDate,
      'validEndDate': endDate
    };

    this.notificationService.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length !== 0) {
          this.trainingResources = response.data;
          console.log('Training resources', this.trainingResources);
        }
        else {
          this.dialogService.alert('No training resources found');
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }

  activate(obj, val) {
    const object = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': obj.notificationTypeID,
      'notificationID': obj.notificationID,
      'roleID': obj.roleID,
      'notification': obj.notification,
      'notificationDesc': obj.notificationDesc,
      'deleted': val,
      'validFrom': obj.validFrom,
      'validTill': obj.validTill,
      'modifiedBy': this.createdBy
    }

    this.notificationService.updateNotification(object)
      .subscribe((response) => {
        if (response.data !== {}) {
          this.dialogService.alert('Training resource activated successfully', 'success');
          this.getTrainingResources();
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert("Failed to activate", 'error')
      });
  }

  deactivate(obj, val) {

    const object = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': obj.notificationTypeID,
      'notificationID': obj.notificationID,
      'roleID': obj.roleID,
      'notification': obj.notification,
      'notificationDesc': obj.notificationDesc,
      'deleted': val,
      'validFrom': obj.validFrom,
      'validTill': obj.validTill,
      'modifiedBy': this.createdBy
    }

    this.notificationService.updateNotification(object)
      .subscribe((response) => {
        if (response.data !== {}) {
          this.dialogService.alert('Training resource deactivated successfully', 'success');
          this.getTrainingResources();
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert('Failed to deactivate', 'error')
      });
  }





  edit(object) {
    console.log('TO BE EDITED OBJ', object);
    this.showTable = false;
    this.showForm = false;
    this.showEditForm = true;

    this.toBeEditedObject = object;
    this.notification_subject = object.notification;
    if (object.kmFileManager !== undefined) {
      this.uploaded_file = object.kmFileManager.fileName;
    }
    else {
      this.uploaded_file = '-';
    }
    // this.uploaded_file = (object ?.kmFileManager ?.fileName !== undefined ? object.kmFileManager.fileName : '-');
    this.description = object.notificationDesc;

    this.count2 = this.description.length + '/300';

  }


  editTrainingResource(form_values) {
    console.log('to be edited values', form_values);
    let editedObj = {};
    if (this.file && this.fileContent) {
      editedObj = {
        'providerServiceMapID': this.providerServiceMapID,
        'notificationTypeID': this.toBeEditedObject.notificationTypeID,
        'notificationID': this.toBeEditedObject.notificationID,
        'roleID': this.toBeEditedObject.roleID,
        'notification': form_values.subject,
        'notificationDesc': form_values.message,
        'validFrom': this.toBeEditedObject.validFrom,
        'validTill': this.toBeEditedObject.validTill,
        'deleted': false,
        'modifiedBy': this.createdBy,
        'kmFileManager': {
          'fileName': this.file.name,
          'fileExtension': '.' + this.file.name.split('.')[1],
          'providerServiceMapID': this.providerServiceMapID,
          'userID': this.userId,
          'validFrom': this.toBeEditedObject.validFrom,
          'validUpto': this.toBeEditedObject.validTill,
          'fileContent': this.fileContent.split(',')[1],
          'createdBy': this.createdBy
        }
      };
    } else {
      editedObj = {
        'providerServiceMapID': this.providerServiceMapID,
        'notificationTypeID': this.toBeEditedObject.notificationTypeID,
        'notificationID': this.toBeEditedObject.notificationID,
        'roleID': this.toBeEditedObject.roleID,
        'notification': form_values.subject,
        'notificationDesc': form_values.message,
        'validFrom': this.toBeEditedObject.validFrom,
        'validTill': this.toBeEditedObject.validTill,
        'deleted': false,
        'modifiedBy': this.createdBy

      }
    }

    this.notificationService.updateNotification(editedObj)
      .subscribe((response) => this.updateSuccess(response),
      (error) => this.notificationError(error));


  }

  updateSuccess(response) {
    console.log(response.data);
    if (response.data) {
      this.dialogService.alert('Training resource updated successfully', 'success');
      this.trainingResourceEditForm.reset();
      this.count = '0/300';
      this.getTrainingResources();
      this.go2table();
    }
  }

  notificationError(error) {
    console.log('error', error);
    this.dialogService.alert('Failed to update', 'error')
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	}
}
