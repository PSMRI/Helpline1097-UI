import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CommunicationService } from './../services/common/communication.service'
import { Subscription } from 'rxjs/Subscription';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { ClearFormService } from './../services/common/clearform.service'

@Component({
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: ['./closure.component.css']
})
export class ClosureComponent implements OnInit
// export class ClosureComponent implements AfterViewInit
{

  @Input() current_language: any;
  currentlanguage: any;
  @ViewChild('Form') closureForm;
  @Output() callClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() closedContinue: EventEmitter<any> = new EventEmitter<any>();
  summaryList: any = [];
  showCallSummary: boolean = false;
  remarks: any;
  callClosureType: any;
  calltypes: any = [];
  isFollowupRequired: boolean = false;
  prefferedDateTime: any;
  callTypeID: any;
  minDate: Date;
  maxDate: Date;
  isFollowUp;
  followUpDate: any;
  picker = '';
  current_campaign: any;
  ipAddress: any;
  agentID: number;
  today: Date;
  compaignSpecific: boolean = false;
  showSlider: boolean;
  benCallID: any;
  beneficiaryRegID: any;
  serviceID: any;
  subscription: Subscription
  callTypeObj: any;
  callSubTypes: any;
  language: any;
  languages: any = [];
  preferredLanguageName: any;
  isCallDisconnected: boolean = false;
  constructor(
    private _callServices: CallServices,
    private saved_data: dataService,
    private message: ConfirmationDialogsService,
    private pass_data: CommunicationService,
    private czentrixServices: CzentrixServices,
    private clearfornData: ClearFormService
  ) {
    this.subscription = this.pass_data.getData().subscribe(benData => { this.outBoundCloseCall(benData) });
    this.subscription = this.clearfornData.clearFormGetter().subscribe(data => { this.clearForm(data) });
  }
  /* Intialization of variable and object has to be come here */
  ngOnInit() {
    const requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.isFollowUp = false;
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      this.callTypeObj = response;
      this.populateCallTypes(response)
    }, (err) => {

    });

    this.today = new Date();
    this.minDate = this.today;
    this.showSlider = false;
    this.current_campaign = this.saved_data.current_campaign;
    if (!this.saved_data.loginIP) {
      this.getIpAddress();
    } else {
      this.ipAddress = this.saved_data.loginIP;
    }
    this.isCallDisconnected = this.saved_data.isCallDisconnected;
    this.getLanguages();
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
  }

  sliderVisibility(val) {
    if (val) {
      this.showSlider = true;
    } else {
      this.showSlider = false;
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }
  }

  populateCallTypes(response: any) {
    let calls = response.map(function (item) {
      return { 'callTypeDesc': item.callGroupType };
    });
    this.calltypes = calls.filter((item) => {
      return item.callTypeDesc.toLowerCase().trim() !== 'transfer';
    })
  }
  getCallSubType(callType: any) {
    // Below variable is used to disable save and continue when call is already disconnected.
    this.isCallDisconnected = this.saved_data.isCallDisconnected;
    this.callSubTypes = this.callTypeObj.filter(function (item) {
      return item.callGroupType === callType;
    }).map(function (previousData, item) {
      return previousData.callTypes;
    })[0];
  }
  // @Input()
  onView() {
    const requestObject = { 'benCallID': this.saved_data.callData.benCallID };
    this._callServices.getCallSummary(requestObject).subscribe(response => this.populateCallSummary(response));
  }
  populateCallSummary(response: any) {
    this.summaryList = [];
    console.log(JSON.stringify(response));
    this.summaryList = response;

    // this.showCallSummary = false;
    // if (this.summaryList.length > 0) {
    //   this.showCallSummary = true;
    // }
  }
  getLanguages() {
    this._callServices.getLanguages().subscribe(response => {

      this.languages = response;
      let preferredlanguageList = this.languages.filter(lang => {
        return lang.languageName.toLowerCase() === 'hindi'
      });
      if (preferredlanguageList) {
        this.preferredLanguageName = preferredlanguageList[0].languageName;
      }
    }, (err) => {

    });
  }
  closeCall(values: any, btnType: any) {
    values.benCallID = this.saved_data.callData.benCallID;
    values.beneficiaryRegID = this.beneficiaryRegID;
    values.providerServiceMapID = this.saved_data.current_service.serviceID;
    // values.preferredLanguageName = values.preferredLanguageName.languageName;
    // Gursimran to look at fixing of followupRequired issue
    if (values.isFollowupRequired == undefined) {
      values.isFollowupRequired = false;
    }

    if (values.prefferedDateTime) {
      values.prefferedDateTime = new Date(values.prefferedDateTime);
      values.prefferedDateTime
        = new Date((values.prefferedDateTime) - 1 * (values.prefferedDateTime.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      values.preferredDateTime = undefined;
    }
    values.createdBy = this.saved_data.uname;
    values.fitToBlock = values.callTypeID.split(',')[1];
    values.callTypeID = values.callTypeID.split(',')[0];
    values.agentID = this.saved_data.cZentrixAgentID;
    values.agentIPAddress = this.ipAddress;
    if (btnType === 'submitClose') {
      values.endCall = true;
    }
    console.log('close called with ' + values);
    if (this.saved_data.current_campaign.toUpperCase() === 'OUTBOUND') {
      this.current_campaign = this.saved_data.current_campaign;
      this._callServices.closeOutBoundCall(this.saved_data.outBoundCallID, true).subscribe((response) => {
        this.closeOutboundCall(btnType, values);
      }, (err) => {
        this.message.alert(err.status);
      })

    } else {
      if (btnType === 'submitClose') {
        this._callServices.closeCall(values).subscribe((response) => {
          if (response) {
            this.showAlert();
            // if (btnType === 'submitClose') {
            this.callClosed.emit(this.current_campaign);
            // } else {
            //   this.closedContinue.emit();
            // }
            // this.pass_data.sendData(this.current_campaign);
          }
        }, (err) => {
          this.message.alert(err.status);
        });
      } else {
        this.message.confirm('Continue', 'Providing New Service to Beneficiary ?').subscribe((res) => {
          if (res) {
            this._callServices.closeCall(values).subscribe((response) => {
              if (response) {
                this.closureForm.reset();
                this.showSlider = false;
                this.isFollowUp = false;
                this.isFollowupRequired = false;
                this.showAlert();
                // if (btnType === 'submitClose') {
                // this.callClosed.emit(this.current_campaign);
                // } else {
                this.closedContinue.emit();
                // }
                // this.pass_data.sendData(this.current_campaign);
              }
            }, (err) => {
              this.message.alert(err.status);
            });
          }

        })
      }
    }

  }

  showAlert() {
    sessionStorage.removeItem("isOnCall");
    this.message.alert('Call Closed Successfully.');
    // alert('Call closed Successful!!!!');
  }
  isFollow(e) {
    if (e.checked) {
      this.isFollowUp = true;
      this.isFollowupRequired = true
    } else {
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }

  }
  outBoundCloseCall(benData: any) {

    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID;
    if (benData.dataPass.i_bendemographics.m_language) {
      this.preferredLanguageName = benData.dataPass.i_bendemographics.m_language.languageName;
      // this.preferredLanguageName = benData.dataPass.i_bendemographics.m_language.map(function (item) {
      //   return {
      //     'languageID': item.languageID,
      //     'languageName': item.languageName
      //   }
      // });
    }
    this.onView();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  getIpAddress() {
    this.czentrixServices.getIpAddress(this.saved_data.Userdata.agentID)
      .subscribe(response => this.ipSuccessHandler(response));
  }
  ipSuccessHandler(response) {
    console.log('fetch ip response: ' + JSON.stringify(response));
    this.ipAddress = response.response.agent_ip;
  }
  closeOutboundCall(btnType: any, values: any) {
    this._callServices.closeCall(values).subscribe((response) => {
      if (response) {
        this.message.alert('Outbound Call Successfully Closed.');
        if (btnType === 'submitClose') {
          this.callClosed.emit(this.current_campaign);
        } else {
          this.closedContinue.emit();
        }
        // this.pass_data.sendData(this.current_campaign);
      }
    }, (err) => {
      this.message.alert(err.status);
    });
  }
  clearForm(item) {
    if (item.dataPass === 'closure') {
      this.closureForm.reset();
      this.showSlider = false;
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
}
