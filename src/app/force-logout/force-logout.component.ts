import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';
import { dataService } from './../services/dataService/data.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.css']
})
export class ForceLogoutComponent implements OnInit {

  @ViewChild('flform') flform: NgForm;
  currentLanguageSet: any;

  constructor(public alertService: ConfirmationDialogsService,
    public forceLogoutService: ForceLogoutService,
    public commonData: dataService,
    private HttpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();

  }

  kickout(obj) {
    console.log(obj, 'object values');
    obj['providerServiceMapID'] = this.commonData.current_service.serviceID;
    this.alertService.confirm('', this.currentLanguageSet.doYouReallyWantToKickout + " " + obj.userName +'?').subscribe(
      response => {
        if (response) {
          this.forceLogoutService.forcelogout(obj)
            .subscribe(res => {
              console.log(res, 'success post force logout');
              if (res.response.toLowerCase() === 'success'.toLowerCase()) {
                this.alertService.alert(this.currentLanguageSet.userLoggedOutSuccessfully, 'success');
                this.flform.reset();
              }
            }, err => {
              console.log(err, 'error post force logout');
              this.alertService.alert(err.errorMessage,'error');
            });
        }
      }
    );

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
