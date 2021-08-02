import { Component, OnInit, Inject, DoCheck } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { Observable, Subject } from 'rxjs';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-view-version-details',
  templateUrl: './view-version-details.component.html',
  styleUrls: ['./view-version-details.component.css']
})
export class ViewVersionDetailsComponent implements OnInit, DoCheck {

  version_UI: any;
  commitID_UI: any;
  version_api: any;
  currentLanguageSet: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<ViewVersionDetailsComponent>,
    private confirmationDialogsService: ConfirmationDialogsService,
    private httpServices: HttpServices ) { }

  ngOnInit() {
    console.log("input", this.input)
   this.assignSelectedLanguage();
  }
  uiVersionDetails(versionDetails) {
    this.version_UI = versionDetails.version;
    this.commitID_UI = versionDetails.commit;
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
