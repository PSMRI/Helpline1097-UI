import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { CallServices } from 'app/services/callservices/callservice.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { Router } from '@angular/router';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";
@Component({
  selector: 'activity-this-week',
  templateUrl: './activity-this-week.component.html',
})
export class ActivityThisWeekComponent implements OnInit {
  role: any;
  campaign: any;
  providerServiceMapID: any;
  current_roleID: any;
  training_resource_count: any = 0;
  kmconfig: any = [];
  kmFiles: any = [];
  @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
  currentLanguageSet: any;

  constructor(public getCommonData: dataService,
    public notificationService: NotificationService,private HttpServices:HttpServices,
    public dialog: MdDialog, private callService: CallServices, private message: ConfirmationDialogsService, public router: Router) {

  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.role = this.getCommonData.current_role.RoleName;
    this.current_roleID = this.getCommonData.current_role.RoleID;
    this.providerServiceMapID = this.getCommonData.current_service.serviceID;
    this.campaign = this.getCommonData.current_campaign;

    this.getNotificationTypes();

  };
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  close() {
    this.hide_component.emit('1');
  };

  getNotificationTypes() {
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe(response => {
        this.kmconfig = response.data.filter((item) => {
          return item.notificationType === 'KM';
        });
        if (this.kmconfig != undefined) {
          if (this.kmconfig.length > 0) {
            this.getKMdocs(this.kmconfig);
          }
        }
      }, err => {
        console.log('Error while fetching kmconfig', err);
      });
  }

  openTrainingDialog() {
    let dialog = this.dialog.open(MessageDialogComponent, {
      width: '700px',
      disableClose: false,
      data: {
        type: this.currentLanguageSet.kmDocs,
        kmdocs: this.kmFiles
      }
    });
  }

  getKMdocs(KMconfig) {
    let startDate = new Date();
    let endDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 0);
    const data = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': KMconfig[0].notificationTypeID,
      'roleIDs': [this.current_roleID],
      'validFrom': new Date(),
      'validTill': new Date()
    }


    this.notificationService.getKMs(data).subscribe(
      response => {
        if (response.data.length > 0) {
          console.log(response.data, 'RESPONSE SUCCESS AFTER KM DOCS FETCH');
          this.kmFiles = response.data;
          this.training_resource_count = this.kmFiles.length;
        }
      }, err => {
        console.log('Error while fetching KM files in dashboard', err);
      }
    );
  }

agentLoginStatus(){
  this.callService.switchToOutbound(this.getCommonData.cZentrixAgentID).subscribe((res) => {
    // if(res.errorMessage.toLowerCase().contains("already in MANUAL mode")){
    //   this.router.navigate(['/MultiRoleScreenComponent/OutboundCallWorklistsComponent']);
    // }
    this.getCommonData.current_campaign = 'OUTBOUND';
    sessionStorage.setItem("current_campaign", 'OUTBOUND');
    this.router.navigate(['/MultiRoleScreenComponent/OutboundCallWorklistsComponent']);
  }, (err) => {
    let errorText: string;
    errorText= err.errorMessage;
    //if (err.errorMessage === "Agent 2016 is already in MANUAL mode")
    if(errorText.includes("already in MANUAL mode")) {
      this.router.navigate(['/MultiRoleScreenComponent/OutboundCallWorklistsComponent']);
  }
  else
    this.message.alert(err.errorMessage, 'error');
  
  })
}

}
