import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from 'app/services/dataService/data.service';
import { NotificationService } from 'app/services/notificationService/notification-service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { LoaderService } from 'app/services/common/loader.service';

@Component({
  selector: 'app-everwell-guidelines-upload',
  templateUrl: './everwell-guidelines-upload.component.html',
  styleUrls: ['./everwell-guidelines-upload.component.css']
})
export class EverwellGuidelinesUploadComponent implements OnInit {

  role: any;
  subject: any;
  startDate: any;
  endDate: any;
  message: any;


  notification_subject: any;
  uploaded_file: any;
  description: any;
  guideline_description:any;
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
  trainingResources: any=[] ;
  //valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  valid_file_extensions = ['pdf'];
  Categories=['> 95 adherence percentage','<= 95 adherence percentage'];
  currentDate: Date = new Date();
  category:any;
  create: boolean;
  guideline_name: any;
  showProgressBar:Boolean=false;


   @ViewChild('trainingResources') trainingResourceForm: NgForm;
  // @ViewChild('trainingResourcesEditForm') trainingResourceEditForm: NgForm;



  constructor(private saved_data: dataService,
    private notificationService: NotificationService,
    public dialogService: ConfirmationDialogsService,public loaderService:LoaderService) { }



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
   
    this.getGuidelines();
    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);
    this.currentDate.setMilliseconds(0);
  }
  onCategoryChange()
  {
    // this.file=null;
    // this.fileList=null;
  }
  go2table() {
    this.file=undefined;
    this.getGuidelines();
    this.trainingResourceForm.reset();
    this.showTable = true;
    this.showEditForm = false;
    this.showForm = false;
  }
  openDoc(content)
  {
    let srcPath=content.replace('data:application/pdf;base64,','');
      // window.open('data:application/pdf;base64,' + srcPath);
      var byteCharacters = atob(srcPath);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
  }
 getGuidelines()
 {
  let req={
    "providerServiceMapID":this.providerServiceMapID
  }
  //this.showProgressBar=true;
  console.log(this.loaderService.loaderState);
  this.notificationService.fetchGuidelines(req)
    .subscribe((response) => {
      console.log(this.loaderService.loaderState);
      //this.showProgressBar=false;
      if (response.data.data !== undefined) {
        this.trainingResources = response.data.data;
      }
      console.log('Training resources', this.trainingResources);
    },
    (error) => {
     // this.showProgressBar=false;
      console.log(error);
    });
 }
  go2form() {
    let c=0;
    if(this.trainingResources !=undefined && this.trainingResources.length>0)
    {
      this.trainingResources.forEach(element => {
        if(element.deleted===false)
        {
          c++;
        }
       
      });
    }
    if(c<2)
    {
      this.showTable = false;
      this.showEditForm = false;
      this.showForm = true;
      this.create=true;
    }
    else
    {
      this.dialogService.alert('Please delete any existing guidelines to continue', 'info');
    }
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
    let defaultObj =undefined;
    let kmFileManager = undefined;
    if (this.file !== undefined) {
       defaultObj = {
         'guidelineName':this.guideline_name,
         'guidelineDesc':this.guideline_description,
        'fileName': (this.file !== undefined) ? this.file.name : '',
        'fileExtension': (this.file !== undefined) ? '.' + this.file.name.split('.')[1] : '',
        'providerServiceMapID': this.providerServiceMapID,
        'fileContent':this.fileContent,
        'createdBy': this.createdBy,
        'validFrom': startDate,
        'validTill': endDate,
        'userID': this.userId,
        'category':this.category
      };
      console.log('req',defaultObj);
    this.notificationService.saveGuidelines(defaultObj)
      .subscribe((response) => {
        if (response.data !== undefined) {
         // this.trainingResources = response.data.data;
         if(response.data.data !== undefined  && response.data.data.id!==undefined)
         {
          console.log("length",response.data.data.length);
         this.trainingResourceForm.reset();
         this.count = '0/300';
         //this.getGuidelines();
         this.dialogService.alert('File uploaded successfully', 'success');
         
         }
         else
         this.dialogService.alert(response.data.data, 'error');
         this.file=undefined;
        }
      },
      (error) => {
        console.log(error);
        this.file=undefined;
      });

    }
    else
    this.dialogService.alert('Please upload document', 'info');
    

  }

  

  trainingResourceErrorHandeler(error) {
    console.log(error);
    this.dialogService.alert(error.json().errorMessage, 'alert');
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
    this.count2 = this.guideline_description.length + '/300';
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
     if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
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

  
 
  deactivate(obj, val) {
    this.dialogService.confirm('Delete ', 'Do you want to delete the guideline?').subscribe((response) => {
      if (response) {
    const object = {
      'id':obj.id,
     'providerServiceMapID': this.providerServiceMapID,
      'modifiedBy': obj.createdBy,
      'deleted':val
    }

    console.log('req',object);
    this.notificationService.deleteGuidelines(object)
      .subscribe((response) => {
        if (response.data !== undefined) {
          this.dialogService.alertConfirm(response.data.response, 'success')
          .subscribe(() => {
            let req={
              "providerServiceMapID":this.providerServiceMapID
            }
            //this.showProgressBar=true;
            this.notificationService.fetchGuidelines(req)
              .subscribe((response) => {
                //this.showProgressBar=false;
                if (response.data.data !== undefined) {
                  this.trainingResources = response.data.data;
                  //this.dialogService.alert(deleteRes, 'success');
                }
                console.log('Training resources', this.trainingResources);
              },
              (error) => {
                //this.showProgressBar=false;
                console.log(error);
              });
          });
      }
     // );
        },
        (error) => {
          console.log(error);
        });
      //}
    //});
      // (error) => {
      //   console.log(error);
      // });
    // }
    // });
  }
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

    // this.notificationService.updateNotification(editedObj)
    //   .subscribe((response) => this.updateSuccess(response),
    //   (error) => this.notificationError(error));


  }

  // updateSuccess(response) {
  //   console.log(response.data);
  //   if (response.data) {
  //     this.dialogService.alert('Training resource updated successfully', 'success');
  //     this.trainingResourceEditForm.reset();
  //     this.count = '0/300';
  //     this.getTrainingResources();
  //     this.go2table();
  //   }
  // }

  notificationError(error) {
    console.log('error', error);
    this.dialogService.alert('Failed to update', 'error')
  }
}
