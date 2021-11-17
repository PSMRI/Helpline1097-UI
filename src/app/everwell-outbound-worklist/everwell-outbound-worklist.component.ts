import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-everwell-outbound-worklist',
  templateUrl: './everwell-outbound-worklist.component.html',
  styleUrls: ['./everwell-outbound-worklist.component.css']
})

export class EverwellOutboundWorklistComponent implements OnInit {
  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  data: any = [];
  filteredsearchResult: any = [];
  currentLanguageSet: any;
  benDetailsList: any;
  constructor(private cz_service : CzentrixServices, private _outBoundService: CallServices, private OCRService: OutboundReAllocationService,
    public alertService: ConfirmationDialogsService, private _common: dataService, public router: Router,
    private HttpServices:HttpServices) {
  }
  
  ngOnInit() {
    this._common.sendHeaderStatus.next("");
    const serviceProviderMapID = this._common.current_service.serviceID;
    const userId = this._common.uid;
    let reqObj = {
      "providerServiceMapId": serviceProviderMapID,
      "agentId": userId
    };  
    this.OCRService.getEverwellOutboundCallList(reqObj).subscribe(response => 
      {
        this.AssignData(response);
        console.log('Everwell Call History Data is', response);
      },
    (err)=> {
      this.alertService.alert(err.errorMessage,'error');
      console.log('Everwell error in call history ');
    });
    this.assignSelectedLanguage();

  };

  AssignData(outboundHistory: any) {
    this.data = outboundHistory;
    this.filteredsearchResult = outboundHistory;
    console.log("beneID in worklist", this.filteredsearchResult)
  }
  //   modaldata:any;
  listBenDetailsOnPhnNo(data: any) {
    this._common.everwellCallNotConnected=null;
    this._common.checkEverwellResponse = false;
    this._common.feedbackData = [];
    this._common.updatedFeedbackList = [];
    this._common.outboundBenRegID = data.beneficiaryRegId;
    // this._common.beneficiaryID = data.beneficiaryID;
    //  this.onOutboundCall.emit(data); code commented, since routing implemented, calling which was happenning in parent is now here....gursimran 24/5/18
    this._common.outboundEverwellData = data;
    console.log("data54", data);
    
    this.cz_service.manualDialaNumber("", data.PrimaryNumber).subscribe((res) => {
      if (res.status.toLowerCase() === 'fail') {
        this.alertService.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
      } else {
        this._common.callerNumber = data.PrimaryNumber;

    //    this._dataServivce.outboundBenID = data.beneficiary.beneficiaryRegID;
   //     this._dataServivce.outboundCallReqID = data.outboundCallReqID;
        sessionStorage.setItem("isOnCall", "yes");
        sessionStorage.setItem("isEverwellCall", "yes");
  //      this._dataServivce.isSelf = data.isSelf;
      }
      console.log('resp', res);
    }, (err) => {
      this.alertService.alert(err.errorMessage);
    });
  }
  backToDashBoard() {
    this.router.navigate(['/MultiRoleScreenComponent/dashboard']);

  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResult = this.data;
    } else {
      this.filteredsearchResult = [];
      this.data.forEach((item) => {
        for (let key in item) {
          if (key == 'FirstName' || key == 'PrimaryNumber' || key == 'beneficiaryID') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResult.push(item); break;
            }
          }
        }
      });
    }

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
