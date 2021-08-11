import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, Renderer, DoCheck } from '@angular/core';
import { RegisterService } from '../services/register-services/register-service';
import { UpdateService } from '../services/update-services/update-service';
import { Router } from '@angular/router';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from '../services/common/location.service';
import { dataService } from '../services/dataService/data.service';
import { BeneficiaryHistoryComponent } from './../beneficiary-history/beneficiary-history.component'
import { MdDialog, MdDialogRef } from '@angular/material';
import { Message } from './../services/common/message.service'
import { CollapseDirective } from './../directives/collapse/collapse.directive'
import { CommunicationService } from './../services/common/communication.service'
import { CzentrixServices } from '../services/czentrix/czentrix.service';

import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { OutboundService } from './../services/common/outbound.services';
import { ReloadService } from './../services/common/reload.service';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { CommonSmsDialogComponent } from '../common-sms-dialog/common-sms-dialog.component';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';

import * as moment from 'moment';
import { LoaderService } from 'app/services/common/loader.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

declare var jQuery: any;

@Component({
  selector: 'app-beneficiary-registration',
  templateUrl: './beneficiary-registration.component.html',
  styleUrls: ['./beneficiary-registration.component.css'],

})
export class BeneficiaryRegistrationComponent implements OnInit, DoCheck {
  @Input() current_language: any;
  @Input() onReloadCall: Boolean;
  @Input() onStartNewCall: Boolean;
  currentlanguage: any;
  p = 1;

  @Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBenSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Output() wentAwayMainScreen: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('ageRef') input: ElementRef;
  @ViewChild('BeneficaryForm') BeneficaryForm;

  @ViewChild('BeneficaryForm') BeneficaryCreationForm: NgForm;

  fname: any = '';
  lname: any = '';
  fhname: any = '';
  stateSelectedd: any;
  citySelectedd: any;
  beneficiaryID: string = undefined;
  // nameFlag: boolean = false;
  //genderFlag: boolean = false;
  BeneficiaryExistsWIthOtherPhNum: boolean = false;

  FirstName: any = '';
  LastName: any = '';
  fatherNameHusbandNameSearch = '';
  DOB: any;
  PhoneNo = '';
  GenderID: any = '';
  TitleId: number;
  MaritalStatusID: number;
  aadharNo: any = '';
  caste: any = '';
  BeneficiaryTypeID: number;
  // educationQualification: any = '';
  state: number;
  district: number;
  taluk: number;
  village: number;
  pincode: any = '';
  preferredLanguage: number;
  ParentBenRegID: number;
  relationShips: any;
  benRegistrationResponse: any;
  registrationNo: any;
  benUpdationResponse: any;
  regHistoryList: any = [];
  beneficiaryParentList: any = [];
  beneficiaryRelations: any = [];
  states: any = [];
  titles: any = [];
  status: any = [];
  benEdus: any = [];
  genders: any = [];
  maritalStatuses: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  communities: any = [];
  directory: any = [];
  language: any = [];
  regHistory: any;
  benRegData: any;
  // states: directory = [];
  calledEarlier = false;
  showSearchResult = false;
  notCalledEarlier;
  updationProcess = false;
  notCalledEarlierLowerPart = false;
  minDate: Date;
  maxDate: Date;
  isParentBeneficiary = false;
  beneficiaryRelationID = 1;
  color;
  calledRadio = true;
  age: any = '';
  updatedObj: any = {};
  relationshipWith: string;
  today: Date;
  dateFormat: string;
  identityType: number;
  identityTypes: any;
  public areaList: any = [];
  searchValue: any;
  isAdvancedSearch: any;
  advanceBtnHide: any;
  gender: any;
  commonData: any;
  spinner;
  spinnerState;
  spinnerVal: any;
  idMaxValue: any;
  patternID: any;
  idErrorText: string;
  idMinValue: any;
  peopleCalledEarlier: boolean = false;
  genderErrFlag: any = false;
  stateErrFlag: any = false;
  subscription: Subscription;
  subcriptionOutbound: Subscription;
  cZentrixIp: any;
  current_campaign: any;
  cityErrFlag: any = false;
  unMaskedNumber: any;
  showTagging: boolean;
  disableViewAll: boolean = true;
  // agentID: any;

  alternateNumber1 = "";
  alternateNumber2 = "";
  alternateNumber3 = "";
  alternateNumber4 = "";
  alternateNumber5 = "";

  // added for masking the alternate numbers
  alternateNumberDisplay1 = "";
  alternateNumberDisplay2 = "";
  alternateNumberDisplay3 = "";
  alternateNumberDisplay4 = "";
  alternateNumberDisplay5 = "";

  //public mobileNumberMask = [ /[^0-9]/, /\d/];

  btnDisabled = false;
  assignSelectedLanguageValue: any;
  constructor(private _util: RegisterService,
    private _router: Router,
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private updateBen: UpdateService,
    private saved_data: dataService,
    private renderer: Renderer,
    private message: Message,
    public dialog: MdDialog,
    private alertMaessage: ConfirmationDialogsService,
    private pass_data: CommunicationService,
    private outboundService: OutboundService,
    private czentrixService: CzentrixServices,
    private reload_call: ReloadService,
    private _smsService: SmsTemplateService,
    private loaderService: LoaderService,
    private httpServices: HttpServices
  ) {

    // this.subcriptionOutbound = this.outboundService.getOutboundData()
    //   .subscribe(benOutboundData => { this.startOutBoundCall(benOutboundData) });

    this.subscription = this.reload_call.getReloadCall().subscribe(callType => { this.reloadCampainCall(callType) }, (err) => {
      this.alertMaessage.alert(err.status, 'error');
      console.log('ERROR', err);
    });
  }

  /* Intialization Of value and object has to be written in here */

  ngOnInit() {
    this.IntializeSessionValues();
    console.log('ageUnit', this.ageUnit);
    this.BeneficaryCreationForm.form.patchValue({
      ageUnit: 'Years'
    })
    this.current_campaign = this.saved_data.current_campaign;
    if (this.saved_data.current_campaign == 'OUTBOUND') {
      this.startOutBoundCall(this.saved_data.outboundData);
    } else {
      this.startNewCall();
    }
    // this.agentID = this.saved_data.cZentrixAgentID;
    // this.reloadOutBoundCall(this.current_campaign);
    this.assignSelectedLanguage();
  }

  ngOnChanges() {
    this.setLanguage(this.current_language);
    // if (this.onReloadCall) {
    //   this.reloadCall();
    // }
    // if (this.onStartNewCall) {
    //   this.startNewCall();
    // }
    this.BeneficaryForm.resetForm();
    this.alternateNumber1 = "";
    this.alternateNumber2 = "";
    this.alternateNumber3 = "";
    this.alternateNumber4 = "";
    this.alternateNumber5 = "";
  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language ben reg tk');
  }

  IntializeSessionValues() {
    this.today = new Date();
    this.maxDate = this.today;
    this.maxDate.setHours(23, 59, 59, 0);
    this.DOB = new Date();
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe((response) => {
        this.SetUserBeneficiaryRegistrationData(response)
      },
      (err) => {
        this.alertMaessage.alert(err.errorMessage, 'error');
        console.log('ERROR', err);
      });
    // this.GetDistricts.getCommonData().subscribe(response => this.commonData = response)
    this.calledEarlier = true;
    this.searchValue = 'Advance Search';
    this.isAdvancedSearch = true;
    this.advanceBtnHide = true;
    this.spinner = false;
    this.spinnerState = true;
    //       this.age = "0";
    // this.calculateDOB("0");
  }

  startOutBoundCall(outboundData: any) {
    const data: any = {};
    data.callID = this.saved_data.callID;
    data.is1097 = true;
    data.createdBy = this.saved_data.uname;
    data.calledServiceID = this.saved_data.current_service.serviceID;
    data.phoneNo = outboundData.beneficiary.benPhoneMaps[0].phoneNo;
    data.agentID = this.saved_data.cZentrixAgentID;

    /*added by diamond on asked by Vinay*/
    data.callReceivedUserID = this.saved_data.uid;
    data.receivedRoleName = this.saved_data.current_role.RoleName;
    /**/
    data.beneficiaryRegID = outboundData.beneficiary.beneficiaryRegID;
    data.isOutbound = this.saved_data.isOutbound;
    this._util.startCall(data).subscribe((response) => {
      this.setBenCall(response);
      // this.czentrixService.getIpAddress(this.saved_data.Userdata.agentID)
      //   .subscribe((ipAddressresponse) => {
      //     this.cZentrixIp = ipAddressresponse.agent_ip;
      //     if (!this.cZentrixIp) {
      //       this.cZentrixIp = this.saved_data.loginIP;
      //     }
      this.outboundEvent(outboundData, this.cZentrixIp)
      // },
      // (error) => {
      //   this.alertMaessage.alert('Some Error while calling Czentrix');
      // });

    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');

    });
  }
  reloadCampainCall(current_campaign: any) {
    if (current_campaign.compainType.toLowerCase() === 'reloadcall') {
      if (this.saved_data.current_campaign.toUpperCase() === 'OUTBOUND') {
        this.retrieveRegHistory(this.saved_data.beneficiaryData.beneficiaryID);
      }
      if (this.saved_data.current_campaign.toUpperCase() === 'INBOUND') {
        this.reloadCall();
      }
    }
    if (current_campaign.compainType.toLowerCase() === 'startcall') {
      if (this.saved_data.current_campaign.toUpperCase() === 'OUTBOUND') {
        this.retrieveRegHistory(this.saved_data.beneficiaryData.beneficiaryID);
        // this.startCall();
      }
      if (this.saved_data.current_campaign.toUpperCase() === 'INBOUND') {
        this.startNewCall();
      }
    }
  }
  outboundEvent(outboundData: any, IpAddress: any) {
    // const params = 'transaction_id=CTI_DIAL&agent_id=' + this.saved_data.Userdata.agentID +
    //   '&ip=' + IpAddress + '&phone_num=' + outboundData.beneficiary.benPhoneMaps[0].phoneNo +
    //   '&resFormat=3';
    // this.czentrixService.callAPI(params)
    //   .subscribe((res) => {
    //     console.log(res);
    //     if (res.response.status == 'SUCCESS') {
    this.retrieveRegHistory(outboundData.beneficiary.beneficiaryID);
    //this.saved_data.current_campaign = 'OUTBOUND';
    this.saved_data.outBoundCallID = outboundData.outboundCallReqID;
    this.current_campaign = this.saved_data.current_campaign;
    //   } else {
    //     this.alertMaessage.alert('Czentrix user not logged In');
    //   }
    // },
    // (error) => {
    //   this.alertMaessage.alert('Call Not Intiating Please try again!!!');
    // });
  }
  reloadCall() {

    if (this.saved_data.current_campaign == 'OUTBOUND') {
      const res = this._util.retrieveRegHistory(this.saved_data.outboundBenRegID)
        .subscribe(response => {
          this.handleRegHistorySuccess(response)
        }, err => {
          this.alertMaessage.alert(err.status, 'error');
          console.log('ERROR', err);
        });
    }
    else {
      this.retrieveRegHistoryByPhoneNo(this.saved_data.callerNumber);

    }
    this.calledEarlier = true;
    this.showSearchResult = false;
    this.notCalledEarlier = false;
    this.updationProcess = false;
    this.notCalledEarlierLowerPart = false;
    this.calledRadio = true;
    this.onBenRegDataSelect.emit(null);
    this.back1();

  }

  startNewCall() {
    this.reloadCall();
    this.startCall();
  }
  startCall() {
    this.BeneficaryForm.resetForm();

    const data: any = {};
    data.callID = this.saved_data.callID;
    data.is1097 = true;
    data.createdBy = this.saved_data.uname;
    data.calledServiceID = this.saved_data.current_service.serviceID;
    data.phoneNo = this.saved_data.callerNumber;
    data.agentID = this.saved_data.cZentrixAgentID;

    /*added by diamond on asked by Vinay*/
    data.callReceivedUserID = this.saved_data.uid;
    data.receivedRoleName = this.saved_data.current_role.RoleName;
    /**/
    data.isOutbound = this.saved_data.isOutbound;
    if( this.saved_data.setUniqueCallIDForInBound===true)
    {
    this._util.startCall(data).subscribe((response) => { this.setBenCall(response);
      this.saved_data.setUniqueCallIDForInBound = false; }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('ERROR', err);

    });
  }
    this.alternateNumber1 = "";
    this.alternateNumber2 = "";
    this.alternateNumber3 = "";
    this.alternateNumber4 = "";
    this.alternateNumber5 = "";
  }

  setBenCall(response) {
    this.saved_data.callData = response;
  }

  SetUserBeneficiaryRegistrationData(response: any) {
    const regData = response;
    if (regData.states) {
      this.states = regData.states;
    }
    if (regData.m_Status) {
      this.status = regData.m_Status;
    }
    if (regData.directory) {
      this.directory = regData.directory;
    }

    if (regData.i_BeneficiaryEducation) {
      this.benEdus = regData.i_BeneficiaryEducation;
    }
    if (regData.m_Title) {
      this.titles = regData.m_Title;
    }
    if (regData.m_genders) {
      this.genders = regData.m_genders;
    }
    if (regData.m_maritalStatuses) {
      this.maritalStatuses = regData.m_maritalStatuses;
    }
    if (regData.m_communities) {
      this.communities = regData.m_communities;
    }
    if (regData.m_language) {
      this.language = regData.m_language;
    }
    if (regData.benRelationshipTypes) {
      this.beneficiaryRelations = regData.benRelationshipTypes;
      this.relationshipWith = 'Beneficiary Tagging';
      this.beneficiaryRelationID = this.getRelationShipType(this.beneficiaryRelations);
    }
    if (regData.govtIdentityTypes) {
      this.identityTypes = regData.govtIdentityTypes;
    }

  }

  calledEarlierCheck(flag) {
    if (flag == false) {
      //   this.editAlternate = false;
    }
    this.alternateNumberDisplay1 = null;
    this.alternateNumberDisplay2 = null;
    this.alternateNumberDisplay3 = null;
    this.alternateNumberDisplay4 = null;
    this.alternateNumberDisplay5 = null;
    this.genderErrFlag = false;
    this.stateErrFlag = false;
    this.cityErrFlag = false;
    // added to reset benID after search
    this.registrationNo = "";
    if (flag) {
      this.calledEarlier = true;
      this.searchValue = 'Advance Search';
      // this.showSearchResult = true;
      this.advanceBtnHide = true;
      this.isAdvancedSearch = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.reloadCall();
      // If condition added for preveting extra api call on radio click.
      if (this.regHistoryList.length > 0) {
        this.onBenRegDataSelect.emit(null);
      }
    }

    if (!flag) {

      // jQuery("#BeneficaryForm").trigger("reset");
      this.BeneficaryForm.resetForm();

      this.searchValue = 'Advance Search';
      this.advanceBtnHide = false;
      // this.isParentBeneficiary = false;
      this.notCalledEarlier = true;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.isAdvancedSearch = true;
      this.onBenRegDataSelect.emit(null);
      this.calledEarlier = false;
      this.showSearchResult = false;
      this.updationProcess = false;
      //..
      // this.FirstName = undefined;
      // this.LastName = undefined;

      // this.PhoneNo = undefined;
      //..
      // this.alternateNumber1 = undefined;
      // this.alternateNumber2 = undefined;
      // this.alternateNumber3 = undefined;
      // this.alternateNumber4 = undefined;
      // this.alternateNumber5 = undefined;
      // this.GenderID = undefined;
      // this.age = undefined;
      // this.TitleId = undefined;
      // this.MaritalStatusID = undefined;
      // this.DOB = undefined;
      // this.aadharNo = undefined;
      // this.caste = undefined;
      // this.BeneficiaryTypeID = undefined;

      // this.educationQualification = undefined;
      //..
      // this.state = undefined;
      // this.district = undefined;
      this.districts = [];
      // this.taluk = undefined;
      this.taluks = [];
      // this.village = undefined;
      this.blocks = [];
      // this.pincode = undefined;
      // this.preferredLanguage = undefined;
      // this.identityType = undefined;
      this.wentAwayMainScreen.emit();
      //             this.age = "0";
      // this.calculateDOB("0"); //for default age to be zero

      // if (this.isParentBeneficiary || this.regHistoryList.length > 0) {
      //   this.isParentBeneficiary = true;
      //   this.beneficiaryRelations = this.beneficiaryRelations.filter(function (item) {
      //     return item.benRelationshipType.toUpperCase() !== 'SELF'; // This value has to go in constant
      //   });
      // }
      // if ()
      // this.beneficiaryRelationID = this.getRelationShipType(this.beneficiaryRelations);
      // this value also comes from the constants
      this.alternateNumber1 = "";
      this.alternateNumber2 = "";
      this.alternateNumber3 = "";
      this.alternateNumber4 = "";
      this.alternateNumber5 = "";
      this.btnDisabled = false;
    }
  }

  titleSelected(value) {
    if (value == 3 || value == 8) {
      this.GenderID = 1;
    } else if (value == 4 || value == 5 || value == 13) {
      this.GenderID = 2;
    } else {
      this.GenderID = "";
    }

    //precautionary code
    if (this.regHistoryList.length === 0) {
      this.beneficiaryRelationID = 1;
    }
  }

  GetDistricts(state: number) {
    this.districts = [];

    this.taluks = [];

    this.blocks = [];
    this.district = undefined;
    this.taluk = undefined;
    this.village = undefined;
    this.spinner = true;
    this.spinnerState = false;
    if (state == undefined) {
      this.stateErrFlag = true;
    } else {
      this.stateErrFlag = false;
      this._locationService.getDistricts(state)
        .subscribe((response) => this.SetDistricts(response), (err) => {
          this.alertMaessage.alert(err.errorMessage, 'error');
          console.log('ERROR', err);
        });
    }
  }
  SetDistricts(response: any) {
    // this.districts.push( { "districtID": undefined, "districtName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // this.districts.push( response[ i ] );
    this.spinner = false;
    this.spinnerState = true;
    this.districts = response;
  }

  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this.taluk = undefined;
    this.village = undefined;
    if (district == undefined) {
      this.cityErrFlag = true;
    } else {
      this.cityErrFlag = false;
      this._locationService.getTaluks(district)
        .subscribe((response) => this.SetTaluks(response), (err) => {
          this.alertMaessage.alert(err.errorMessage, 'error');
          console.log('ERROR', err);
        });
    }
  }
  SetTaluks(response: any) {
    this.taluks = response;
    // this.taluks.push( { "blockID": undefined, "blockName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    //  this.taluks.push( response[ i ] );
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    this.village = undefined;
    this._locationService.getBranches(taluk)
      .subscribe((response) => { this.SetBlocks(response) }, (err) => {
        this.alertMaessage.alert(err.errorMessage, 'error');
        console.log('ERROR', err);
      });
  }
  SetBlocks(response: any) {
    this.blocks = response;
    // this.blocks.push( { "districtBranchID": undefined, "villageName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    //  this.blocks.push( response[ i ] );
  }

  /**
   * Neeraj Code; 22-jun-2017
   */
  capturePrimaryInfo() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
    this.calledRadio = true;
  }

  captureOtherInfo() {
    this.notCalledEarlierLowerPart = true;
    this.notCalledEarlier = false;
    this.calledRadio = false;
  }

  editBenPrimaryContent() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
    this.calledRadio = true;
  }
  /**
   *End of Neeraj Code; 22-jun-2017
   */

  registerBeneficiary() {
    this.btnDisabled = true;
    this.loaderService.show();
    this.updatedObj = {};
    console.log("vanID/serviceID:" + this.saved_data.current_serviceID);
    this.updatedObj.vanID = this.saved_data.current_serviceID;
    this.updatedObj.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + 'T00:00:00.000Z';
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    this.updatedObj.benPhoneMaps = [];
    this.updatedObj.benPhoneMaps[0] = {};
    this.updatedObj.benPhoneMaps[0].parentBenRegID = this.ParentBenRegID;
    this.updatedObj.benPhoneMaps[0].benRelationshipID = this.beneficiaryRelationID;
    this.updatedObj.benPhoneMaps[0].phoneNo = this.saved_data.callerNumber;
    this.updatedObj.benPhoneMaps[0].createdBy = this.saved_data.uname;
    this.updatedObj.benPhoneMaps[0].deleted = false;
    // if (this.PhoneNo) {
    //   this.updatedObj.benPhoneMaps[1] = {};
    //   this.updatedObj.benPhoneMaps[1].parentBenRegID = this.ParentBenRegID;
    //   this.updatedObj.benPhoneMaps[1].benRelationshipID = this.beneficiaryRelationID;
    //   this.updatedObj.benPhoneMaps[1].phoneNo = this.PhoneNo;
    //   this.updatedObj.benPhoneMaps[1].createdBy = this.saved_data.uname;
    //   this.updatedObj.benPhoneMaps[1].deleted = false;
    // }

    if (this.alternateNumber1) {
      this.updatedObj.benPhoneMaps[1] = {};
      this.updatedObj.benPhoneMaps[1].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[1].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[1].phoneNo = this.alternateNumber1;
      this.updatedObj.benPhoneMaps[1].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[1].deleted = false;
    }

    if (this.alternateNumber2) {
      this.updatedObj.benPhoneMaps[2] = {};
      this.updatedObj.benPhoneMaps[2].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[2].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[2].phoneNo = this.alternateNumber2;
      this.updatedObj.benPhoneMaps[2].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[2].deleted = false;
    }

    if (this.alternateNumber3) {
      this.updatedObj.benPhoneMaps[3] = {};
      this.updatedObj.benPhoneMaps[3].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[3].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[3].phoneNo = this.alternateNumber3;
      this.updatedObj.benPhoneMaps[3].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[3].deleted = false;
    }

    if (this.alternateNumber4) {
      this.updatedObj.benPhoneMaps[4] = {};
      this.updatedObj.benPhoneMaps[4].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[4].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[4].phoneNo = this.alternateNumber4;
      this.updatedObj.benPhoneMaps[4].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[4].deleted = false;
    }

    if (this.alternateNumber5) {
      this.updatedObj.benPhoneMaps[5] = {};
      this.updatedObj.benPhoneMaps[5].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[5].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[5].phoneNo = this.alternateNumber5;
      this.updatedObj.benPhoneMaps[5].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[5].deleted = false;
    }
    this.updatedObj.govtIdentityNo = this.aadharNo;
    this.updatedObj.govtIdentityTypeID = this.identityType;
    this.updatedObj.deleted = false;
    this.updatedObj.createdBy = this.saved_data.Userdata.userName;
    this.updatedObj.govtIdentityTypeID = 1;
    this.updatedObj.statusID = 1;
    this.updatedObj.i_bendemographics = {};
    this.updatedObj.i_bendemographics.communityID = this.caste;
    // this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.deleted = false;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;

    const res = this._util.generateReg(this.updatedObj).subscribe(response => {
      this.benRegistrationResponse = response;
      if (this.preferredLanguage != undefined && this.preferredLanguage != null) {
        this.setBeneficiaryLanguageInCZentrix('update', this.preferredLanguage);
      }

      this.handleRegHistorySuccess([response]);
      this.showAlert();
      this.populateUserData(response);
      this.onBenSelect.emit('benService');
      this.showSearchResult = false;
      this.notCalledEarlierLowerPart = false;
      this.loaderService.hide();
    }, (err) => {
      this.btnDisabled = false;
      this.loaderService.hide();
      this.alertMaessage.alert(err.status, 'error');
      console.log('ERROR', err);
    });
  }

  setBeneficiaryLanguageInCZentrix(action, language) {
    let language_obj = {};
    let lang = language;
    if (lang != undefined) {
      language_obj = this.language.filter(function (item) {
        return item.languageID === lang;
      });
    }
    let req_obj = {
      'cust_ph_no': this.saved_data.callerNumber,
      'campaign_name': this.saved_data.currentCampaignName,
      'language': language_obj[0].languageName,
      'action': action
    };
    this.czentrixService.setCustomerPreferredLanguage(req_obj)
      .subscribe(response => {
        console.log(response, 'RESPONSE for setting language in czentrix');
        if (response.data != undefined) {
          if (response.data.response.status.toUpperCase() === 'Success'.toUpperCase()) {
            console.log('Language set successfully in CZentrix for Beneficiary');
          }
        }
      }, err => {
        console.log(err, 'Error while setting language in CZentrix for Beneficiary');
        this.alertMaessage.alert('Desired language not set in CZentrix', 'error');
      });
  }

  showAlert() {
    this.BeneficaryForm.resetForm();
    // this.alertMaessage.alert('Beneficiary registered with ID :' + this.benRegistrationResponse.beneficiaryID, 'success');
    let dialogReff = this.dialog.open(CommonSmsDialogComponent, {
      disableClose: true,
      width: '420px',
      data: {
        'statement': 'Beneficiary registered with ID ',
        'generatedID': this.benRegistrationResponse.beneficiaryID
      }
    });

    dialogReff.afterClosed().subscribe(result => {
      let mobile_number;
      mobile_number = result;

      if (mobile_number != 'close' && (mobile_number === undefined || mobile_number === '')) {
        // mobile no is undefined
        console.log('Registered number will be used'); // Registered number will be used
        // ** code to send SMS **
        this.sendSMS(this.benRegistrationResponse.beneficiaryRegID);
      } else if (mobile_number != 'close' && (mobile_number != undefined && mobile_number != '')) {
        // ** code to send SMS **
        this.sendSMS(this.benRegistrationResponse.beneficiaryRegID, mobile_number);
      }
    });
    this.alternateNumber1 = "";
    this.alternateNumber2 = "";
    this.alternateNumber3 = "";
    this.alternateNumber4 = "";
    this.alternateNumber5 = "";
  }

  retrieveRegHistoryByPhoneNo(PhoneNo: any) {

    const res = this._util.retrieveRegHistoryByPhoneNo(PhoneNo)
      .subscribe(response => {
        this.handleRegHistorySuccess(response)
      }, err => {
        this.alertMaessage.alert(err.status, 'error');
        console.log('ERROR', err);
      });
  }

  retrieveRegHistory(reg_no: any) {
    this.back1();
    if (!reg_no || reg_no === '') {
      this.reloadCall();
      this.disableViewAll = true;
      this.registrationNo = "";
    } else {
      this.disableViewAll = false;
      const res = this._util.retrieveRegHistory(reg_no)
        .subscribe(response => {
          this.handleRegHistorySuccess(response)
        }, err => {
          this.alertMaessage.alert(err.status, 'error');
          console.log('ERROR', err);
        });
    }

  }

  handleRegHistorySuccess(response: any) {
    if (response) {
      // console.log('KARNE LAGE HAI SET VALUE OF BEN SELECTED');
      // this.saved_data.beneficiarySelected.next({
      //   'beneficiarySelected': true
      // });
      this.state = undefined;
      this.preferredLanguage = undefined;

      this.saved_data.beneficiary_regID_subject.next({ 'beneficiaryRegID': response[0].beneficiaryRegID });
      this.saved_data.benRegId= response[0].beneficiaryRegID;
      this.regHistoryList = response;
      console.log(this.regHistoryList);
      this.showSearchResult = true;
    }
    if (this.regHistoryList.length > 0) {
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.saved_data.parentBeneficiaryData = this.regHistoryList[0];
      this.beneficiaryRelations = this.beneficiaryRelations.filter(function (item) {
        return item.benRelationshipType.toUpperCase() !== 'SELF'; // This value has to go in constant
      });
      this.beneficiaryRelationID = undefined;

      this.relationshipWith = 'Relationship with  ' + (this.regHistoryList[0].firstName ? this.regHistoryList[0].firstName : "")
        + ' ' + (this.regHistoryList[0].lastName ? this.regHistoryList[0].lastName : "");
      console.log('relationship with', this.regHistoryList[0].firstName, this.regHistoryList[0].lastName);
      if (this.regHistoryList[0].firstName != undefined && this.regHistoryList[0].lastname != undefined) {
        this.relationshipWith = 'Relationship with  ' + this.regHistoryList[0].firstName + ' ' + this.regHistoryList[0].lastName;
      }
      this.ParentBenRegID = this.regHistoryList[0].benPhoneMaps[0].parentBenRegID;
      // if (this.regHistoryList[0].benPhoneMaps[0].parentBenRegID !== this.regHistoryList[0].benPhoneMaps[0].benificiaryRegID) {
      // if ((this.regHistoryList[0].benPhoneMaps[0].parentBenRegID !== this.regHistoryList[0].benPhoneMaps[0].benificiaryRegID)) {
      this.getParentData(this.regHistoryList[0].benPhoneMaps[0].parentBenRegID);
      this.peopleCalledEarlier = true;
      this.isParentBeneficiary = true;

      // }
      // this.selectBeneficiary(this.saved_data.parentBeneficiaryData);
    }
  }

  handleSuccess(response: any) {
    this.relationShips = response;
  }

  // setting the data of selected beneficiary on the top section as BEN. Data for
  // the agent to see
  editAlternate: Boolean = false;

  passBenRegHistoryData(benRegData: any) {
    //  this.editAlternate = true;
    this.notCalledEarlier = true;
    this.calledEarlier = false;
    this.showSearchResult = false;
    this.updationProcess = true;
    this.isParentBeneficiary = true;
    this.isAdvancedSearch = true;
    this.advanceBtnHide = false;
    this.populateUserData(benRegData);
  }

  updatebeneficiaryincall(benRegData: any) {
    this.saved_data.callData.beneficiaryRegID = benRegData.beneficiaryRegID;
    this.saved_data.callData['isCalledEarlier'] = this.calledEarlier;
    this._util.updatebeneficiaryincall(this.saved_data.callData).subscribe(
      response => {
        console.log('Update Beneficiary in Call SUCCESS', response);
      }, err => {
        console.log('Update Beneficiary in Call ERROR', err);
      }
    );
  }


  populateUserData(benRegData: any) {
    let addBenCallID = Object.assign({}, benRegData, {"benCallID": this.saved_data.callData.benCallID})
    this.updatebeneficiaryincall(addBenCallID);
    const res = this._util.retrieveRegHistory(benRegData.beneficiaryID)
      .subscribe(response => {
        if (response.length > 0) {
          this.populateRegistrationFormForUpdate(response[0])
        } else {
          this.alertMaessage.alert('No data found');
        }

      }, err => {
        this.alertMaessage.alert(err.errorMessage, 'error');
        console.log('ERROR', err);
      });

    this.benRegData = benRegData;
  }

  populateRegistrationFormForUpdate(registeredBenData) {
    this.wentAwayMainScreen.emit();
    this.DOB = null;
    this.age = null;
    this.ageUnit = 'Years';
    this.BeneficaryCreationForm.form.patchValue({
      age: null,
      ageUnit: 'Years'
    })
    console.log('registered ben data is :', registeredBenData)
    this.FirstName = registeredBenData.firstName;
    this.LastName = registeredBenData.lastName;
    this.GenderID = registeredBenData.genderID;
    if (registeredBenData.dOB != undefined) {
      this.DOB = new Date(registeredBenData.dOB);
    }
    this.TitleId = registeredBenData.titleId;
    this.MaritalStatusID = registeredBenData.maritalStatusID;
    if (registeredBenData.benPhoneMaps[0]) {
      this.ParentBenRegID = registeredBenData.benPhoneMaps[0].parentBenRegID;
    }
    // if (registeredBenData.benPhoneMaps[1]) {
    //   this.PhoneNo = registeredBenData.benPhoneMaps[1].phoneNo;


    // this.PhoneNo = 'XXXXXX' + registeredBenData.benPhoneMaps[1].phoneNo.toString()
    //   .substring(this.unMaskedNumber.length - 4 > 0 ? (this.unMaskedNumber.length - 4) : 0, this.unMaskedNumber.length);


    // }

    for (let i = 1; i < registeredBenData.benPhoneMaps.length; i++) {
      if (i == 1) {
        this.alternateNumberDisplay1 = registeredBenData.benPhoneMaps[i].phoneNo;
        if (this.alternateNumberDisplay1 != "")
          this.alternateNumber1 = this.alternateNumberDisplay1.substring(0, 3) + 'XXXX' + this.alternateNumberDisplay1.substring(7, 10);
      }
      if (i == 2) {
        this.alternateNumberDisplay2 = registeredBenData.benPhoneMaps[i].phoneNo;
        if (this.alternateNumberDisplay2 != "")
          this.alternateNumber2 = this.alternateNumberDisplay2.substring(0, 3) + 'XXXX' + this.alternateNumberDisplay2.substring(7, 10);
      }
      if (i == 3) {
        this.alternateNumberDisplay3 = registeredBenData.benPhoneMaps[i].phoneNo;
        if (this.alternateNumberDisplay3 != "")
          this.alternateNumber3 = this.alternateNumberDisplay3.substring(0, 3) + 'XXXX' + this.alternateNumberDisplay3.substring(7, 10);
      }
      if (i == 4) {
        this.alternateNumberDisplay4 = registeredBenData.benPhoneMaps[i].phoneNo;
        if (this.alternateNumberDisplay4 != "")
          this.alternateNumber4 = this.alternateNumberDisplay4.substring(0, 3) + 'XXXXX' + this.alternateNumberDisplay4.substring(7, 10);
      }
      if (i == 5) {
        this.alternateNumberDisplay5 = registeredBenData.benPhoneMaps[i].phoneNo;
        if (this.alternateNumberDisplay5 != "")
          this.alternateNumber5 = this.alternateNumberDisplay5.substring(0, 3) + 'XXXX' + this.alternateNumberDisplay5.substring(7, 10);
      }
    }
    this.aadharNo = registeredBenData.govtIdentityNo;
    this.identityType = registeredBenData.govtIdentityTypeID;
    this.caste = registeredBenData.i_bendemographics.communityID;
    // this.educationQualification = registeredBenData.i_bendemographics.educationID;
    this.state = registeredBenData.i_bendemographics.stateID;

    this.GetDistricts(this.state);
    this.district = registeredBenData.i_bendemographics.districtID;
    console.log(registeredBenData.i_bendemographics.districtID, "experiment 1", this.districts);

    this.GetTaluks(this.district);
    this.taluk = registeredBenData.i_bendemographics.blockID;
    console.log("experiment 2", this.taluks);

    if (this.taluk) {
      this.GetBlocks(this.taluk);
    }

    this.village = registeredBenData.i_bendemographics.districtBranchID;
    console.log("experiment 3", this.blocks);
    if (this.DOB != undefined) {
      this.calculateAge(this.DOB);
      this.dobChangeByCalender(this.DOB);
    }
    // this.age = registeredBenData.age;
    // Checking whether it has parent or not
    // if (registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID === 1) { 
    if (registeredBenData.benPhoneMaps[0].parentBenRegID === registeredBenData.benPhoneMaps[0].benificiaryRegID) {
      this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
      this.isParentBeneficiary = false;
    } else {
      this.beneficiaryRelations = this.beneficiaryRelations.filter(function (item) {
        return item.benRelationshipType.toUpperCase() !== 'SELF'; // This value has to go in constant
      });
      if (registeredBenData.benPhoneMaps[0] != undefined && registeredBenData.benPhoneMaps[0].benRelationshipType != undefined && registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID != undefined && registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID != null ){
      this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
      }
    }

    /* do not delete, commented because the district,taluk and village were not populting
    while editing the details*/

    // if (this.state) {
    //   this.GetDistricts(this.state);
    // }
    // if (this.district) {
    //   this.GetTaluks(this.district);
    // }
    // if (this.taluk) {
    //   this.GetBlocks(this.taluk);
    // }

    this.pincode = registeredBenData.i_bendemographics.pinCode;
    this.preferredLanguage = registeredBenData.i_bendemographics.preferredLangID;

    this.updatedObj = registeredBenData;
    this.saved_data.beneficiaryData = registeredBenData;
    this.onBenRegDataSelect.emit(this.benRegData);
    this.sendData(registeredBenData);
  }

  updateBeneficiary() {
    this.updatedObj.vanID = this.saved_data.current_serviceID;

    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.DOB = new Date(this.DOB);
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    // this.updatedObj.parentBenRegID = this.ParentBenRegID;
    // this.updatedObj.altPhoneNo = this.PhoneNo;
    if(this.updatedObj.benPhoneMaps != undefined && this.updatedObj.benPhoneMaps != null){
    let phones = this.updatedObj.benPhoneMaps.length;
    }
    // commented on 28 may till * point

    // if (this.alternateNumber1 && phones === 1) {
    //   const obj = {};
    //   obj['parentBenRegID'] = this.ParentBenRegID;
    //   obj['benificiaryRegID'] = this.updatedObj.beneficiaryRegID;
    //   obj['benRelationshipID'] = this.beneficiaryRelationID;
    //   obj['phoneNo'] = this.alternateNumber1;
    //   obj['modifiedBy'] = this.saved_data.uname;
    //   obj['createdBy'] = this.saved_data.uname;
    //   obj['deleted'] = false;
    //   this.updatedObj.benPhoneMaps.push(obj);
    // }

    // for (let index = 0; index < phones; index++) {
    //   this.updatedObj.benPhoneMaps[index].parentBenRegID = this.ParentBenRegID;
    //   this.updatedObj.benPhoneMaps[index].benificiaryRegID = this.updatedObj.beneficiaryRegID;
    //   this.updatedObj.benPhoneMaps[index].benRelationshipID = this.beneficiaryRelationID;
    //   if (index === 1) {
    //     this.updatedObj.benPhoneMaps[index].phoneNo = this.alternateNumber1;
    //   }
    //   if (index === 2) {
    //     this.updatedObj.benPhoneMaps[index].phoneNo = this.alternateNumber2;
    //   }
    //   if (index === 3) {
    //     this.updatedObj.benPhoneMaps[index].phoneNo = this.alternateNumber3;
    //   }
    //   if (index === 4) {
    //     this.updatedObj.benPhoneMaps[index].phoneNo = this.alternateNumber4;
    //   }
    //   if (index === 5) {
    //     this.updatedObj.benPhoneMaps[index].phoneNo = this.alternateNumber5;
    //   }
    //   if (this.updatedObj.benPhoneMaps[index].createdBy) {
    //     this.updatedObj.benPhoneMaps[index].modifiedBy = this.saved_data.uname;
    //   } else {
    //     this.updatedObj.benPhoneMaps[index].createdBy = this.saved_data.uname;
    //     this.updatedObj.benPhoneMaps[index].deleted = false;
    //   }
    // }

    // commented on 28 may till here *

    // NEW DATA FROM 104 on 28may

    let numString = (this.alternateNumberDisplay1 ? this.alternateNumberDisplay1 : this.alternateNumber1) + (this.alternateNumberDisplay2 ? this.alternateNumberDisplay2 : this.alternateNumber2) + (this.alternateNumberDisplay3 ? this.alternateNumberDisplay3 : this.alternateNumber3) + (this.alternateNumberDisplay4 ? this.alternateNumberDisplay4 : this.alternateNumber4) + (this.alternateNumberDisplay5 ? this.alternateNumberDisplay5 : this.alternateNumber5);
    // debugger;
    // console.log("numString.split(this.alternateNumber5).length", numString.split(this.alternateNumber5).length);
    // console.log("numString.indexOf(this.alternateNumber3)",numString.indexOf(this.alternateNumber3));
    // console.log("numString.indexOf(this.alternateNumber2)",numString.indexOf(this.alternateNumber2));


    // debugger;
    if (this.alternateNumber5 != "" && (this.alternateNumberDisplay5 ? numString.includes(this.alternateNumberDisplay5) : numString.includes(this.alternateNumber5)) && (this.alternateNumberDisplay5 ? numString.indexOf(this.alternateNumberDisplay5) < this.alternateNumber2.length + this.alternateNumber1.length + this.alternateNumber3.length + this.alternateNumber4.length : numString.indexOf(this.alternateNumber5) < (this.alternateNumber2.length + this.alternateNumber1.length + this.alternateNumber3.length + this.alternateNumber4.length))) {
      // debugger;

      // alternate number 5 already exists
      this.alertMaessage.alert("Alternate number 5 already exits", 'error');
      return;
    } else if (this.alternateNumber4 != "" && (this.alternateNumberDisplay4 ? numString.includes(this.alternateNumberDisplay4) : numString.includes(this.alternateNumber4)) && (this.alternateNumberDisplay4 ? numString.indexOf(this.alternateNumberDisplay4) < (this.alternateNumber2.length + this.alternateNumber1.length + this.alternateNumber3.length) : numString.indexOf(this.alternateNumber4) < (this.alternateNumber2.length + this.alternateNumber1.length + this.alternateNumber3.length))) {
      // debugger;

      // alternate number 4 already exists
      this.alertMaessage.alert("Alternate number 4 already exits", 'error');
      return;
    }
    else if (this.alternateNumber3 != "" && (this.alternateNumberDisplay3 ? numString.includes(this.alternateNumberDisplay3) : numString.includes(this.alternateNumber3)) && (this.alternateNumberDisplay3 ? numString.indexOf(this.alternateNumberDisplay3) < (this.alternateNumber2.length + this.alternateNumber1.length) : numString.indexOf(this.alternateNumber3) < (this.alternateNumber2.length + this.alternateNumber1.length))) {
      // debugger;
      // alternate number 3 already exists
      console.log(numString.includes(this.alternateNumberDisplay3));
      console.log(numString.includes(this.alternateNumber3));
      console.log(numString.indexOf(this.alternateNumberDisplay3) < 20);
      console.log(numString.indexOf(this.alternateNumber3) < 20);
      this.alertMaessage.alert("Alternate number 3 already exits", 'error');
      return;
    }
    else if (this.alternateNumber2 != "" && (this.alternateNumberDisplay2 ? numString.includes(this.alternateNumberDisplay2) : numString.includes(this.alternateNumber2)) && (this.alternateNumberDisplay2 ? numString.indexOf(this.alternateNumberDisplay2) < (this.alternateNumber1.length) : numString.indexOf(this.alternateNumber2) < (this.alternateNumber1.length))) {
      console.log(numString.indexOf(this.alternateNumber2) < 10);
      console.log(numString.indexOf(this.alternateNumberDisplay2) < 10);
      console.log(numString.includes(this.alternateNumberDisplay2));
      console.log(numString.includes(this.alternateNumber2));
      // alternate number 2 already exists
      this.alertMaessage.alert("Alternate number 2 already exits", 'error');
      return;
    }
        
    for (let j = 1; j < 6; j++) {
      if (this.updatedObj.benPhoneMaps != undefined && this.updatedObj.benPhoneMaps[j]) {
        this.updatedObj.benPhoneMaps[j].createdBy = this.saved_data.uname;
        this.updatedObj.benPhoneMaps[j].parentBenRegID = this.ParentBenRegID;
        this.updatedObj.benPhoneMaps[j].benificiaryRegID = this.updatedObj.beneficiaryRegID;
        this.updatedObj.benPhoneMaps[j].benRelationshipID = this.beneficiaryRelationID;

        if (j === 1) {
          if (this.alternateNumberDisplay1 != "") {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumberDisplay1
          }
          else {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumber1;
          }
        }
        if (j === 2) {
          if (this.alternateNumberDisplay2 != "") {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumberDisplay2;
          }
          else {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumber2;
          }
        }
        if (j === 3) {
          if (this.alternateNumberDisplay3 != "") {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumberDisplay3
          }
          else {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumber3;
          }
        }
        if (j === 4) {
          if (this.alternateNumberDisplay4 != "") {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumberDisplay4
          }
          else {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumber4
          }
        }
        if (j === 5) {
          if (this.alternateNumberDisplay5 != "") {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumberDisplay5
          }
          else {
            this.updatedObj.benPhoneMaps[j].phoneNo = this.alternateNumber5
          }
        }
        if (this.updatedObj.benPhoneMaps[j].createdBy) {
          this.updatedObj.benPhoneMaps[j].modifiedBy = this.saved_data.uname;
        }
        else {
          this.updatedObj.benPhoneMaps[j].createdBy = this.saved_data.uname;
          this.updatedObj.benPhoneMaps[j].deleted = false;
        }
        if(this.updatedObj.benPhoneMaps[j].createdBy ==undefined ||this.updatedObj.benPhoneMaps[j].createdBy==null)
        this.updatedObj.benPhoneMaps[j].createdBy = this.saved_data.uname;
      } else {
        const obj = {};
        obj['parentBenRegID'] = this.ParentBenRegID;
        obj['benificiaryRegID'] = this.updatedObj.beneficiaryRegID;
        obj['benRelationshipID'] = this.beneficiaryRelationID;
        if (j === 1) {
          obj['phoneNo'] = this.alternateNumber1;
        }
        if (j === 2) {
          obj['phoneNo'] = this.alternateNumber2;
        }
        if (j === 3) {
          obj['phoneNo'] = this.alternateNumber3;
        }
        if (j === 4) {
          obj['phoneNo'] = this.alternateNumber4;
        }
        if (j === 5) {
          obj['phoneNo'] = this.alternateNumber5;
        }
        obj['modifiedBy'] = this.saved_data.uname;
        obj['createdBy'] = this.saved_data.uname;
        obj['deleted'] = false;
        if( this.updatedObj.benPhoneMaps!=undefined)
        {
          // if(this.updatedObj.benPhoneMaps[j].createdBy ==undefined ||this.updatedObj.benPhoneMaps[j].createdBy==null)
          // this.updatedObj.benPhoneMaps[j].createdBy = this.saved_data.uname;
          this.updatedObj.benPhoneMaps.push(obj);
        }
       
        else{
          this.updatedObj.benPhoneMaps={};
          this.updatedObj.benPhoneMaps.push(obj);
        }
      }

    }

    // ends

    this.updatedObj.govtIdentityNo = this.aadharNo;
    this.updatedObj.govtIdentityTypeID = this.identityType;
    if (!this.updatedObj.i_bendemographics.beneficiaryRegID) {
      this.updatedObj.i_bendemographics.beneficiaryRegID = this.updatedObj.beneficiaryRegID;
    }
    this.updatedObj.i_bendemographics.communityID = this.caste;
    // this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;

    this.updatedObj.is1097 = true;
    this.updatedObj.changeInSelfDetails = true;
    this.updatedObj.changeInAddress = true;
    this.updatedObj.changeInContacts = true;
    this.updatedObj.changeInIdentities = true;
    this.updatedObj.changeInOtherDetails = true;
    this.updatedObj.changeInFamilyDetails = true;
    this.updatedObj.changeInAssociations = true;
    this.updatedObj.changeInBankDetails = false;
    this.updatedObj.changeInBenImage = false;
    // saving the updated ben data in the in_app_saved data service file
    this.saved_data.beneficiaryData = this.updatedObj;
    // return;
    if(this.updatedObj.benPhoneMaps && this.updatedObj.benPhoneMaps.length >0)
    {
      for(var i=0;i<this.updatedObj.benPhoneMaps.length;i++)
      {
        if(this.updatedObj.benPhoneMaps[i].createdBy === undefined || this.updatedObj.benPhoneMaps[i].createdBy===null)
        this.updatedObj.benPhoneMaps[i].createdBy=this.saved_data.uname;
      }
    }
    this.updateBen.updateBeneficiaryData(this.updatedObj).subscribe((response) => {
      this.updateSuccessHandeler(response)
    }, (err) => {
      this.alertMaessage.alert(err.status, 'error');
      console.log('ERROR', err);
    });
  }
  alternateNumber(value, e) {
    console.log(e);
    if (e.keyCode == '8' || e.keyCode == '127' && this.updationProcess) {
      switch (value) {
        case 1: {
          this.alternateNumberDisplay1 = "";
          this.alternateNumber1 = "";
          break;
        }
        case 2: {
          this.alternateNumberDisplay2 = "";
          this.alternateNumber2 = "";
          break;
        }
        case 3: {
          this.alternateNumberDisplay3 = "";
          this.alternateNumber3 = "";
          break;
        }
        case 4: {
          this.alternateNumberDisplay4 = "";
          this.alternateNumber4 = "";
          break;
        }
        case 5: {
          this.alternateNumberDisplay5 = "";
          this.alternateNumber5 = "";
          break;
        }
      }
    }
  }

  updateSuccessHandeler(response) {
    if (response) {
      this.alertMaessage.alert('Beneficiary updated successfully', 'success');
      this.populateUserData(response);

      //   this.editAlternate = false;
      if (this.preferredLanguage != undefined && this.preferredLanguage != null) {
        this.setBeneficiaryLanguageInCZentrix('update', this.preferredLanguage);
      }
      this.BeneficaryForm.resetForm();
      this.benUpdationResponse = response;
      // this.regHistoryList = [response];
      this.regHistoryList = '';
      this.regHistoryList = [response];
      this.showSearchResult = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.onBenSelect.emit('benService');
      this.selectBeneficiary(this.saved_data.beneficiaryData, 'update');
    }
    this.alternateNumber1 = "";
    this.alternateNumber2 = "";
    this.alternateNumber3 = "";
    this.alternateNumber4 = "";
    this.alternateNumber5 = "";
  }

  /**
   * NEERAJ; Select beneficiary for service provided; 27-JUN-2017
   */
  selectBeneficiary(regHistory: any, Type?: any) {

    this.saved_data.benRegId = regHistory.beneficiaryRegID;

    if (Type === 'update') {
      this.populateUserData(regHistory);
      this.onBenSelect.emit('benService');
      this.showSearchResult = false;
      this.notCalledEarlierLowerPart = false;
    } else {
      const dialogRef = this.dialog.open(BeneficiaryHistoryComponent, {
        // height: '70%',

        // width: '80%',
        disableClose: true,
        data: regHistory.beneficiaryRegID,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.populateUserData(regHistory);
        this.onBenSelect.emit('benService');
        this.showSearchResult = false;
        this.notCalledEarlierLowerPart = false;
        this.saved_data.beneficiarySelected.next({
          "beneficiarySelected": true
        });
      });
    }
    this.registrationNo = "";
  }

  getRelationShipType(relationShips) {
    let benificiaryRelationType = [];
    benificiaryRelationType = relationShips.filter(function (item) {
      return item.benRelationshipType.toUpperCase() === 'SELF'; // This value has to go in constant
    });
    let beneficiaryRelationID;
    if (benificiaryRelationType.length > 0) {
      beneficiaryRelationID = benificiaryRelationType[0]['benRelationshipID']
    }
    if (this.regHistoryList.length === 0) {
      return beneficiaryRelationID;
    }

  }
  // Handling Error
  getParentData(parentBenID) {
    this._util.retrieveBenDetailsByRegID(parentBenID).subscribe((response) => {
      if (response) {
        if (response.length > 0) {
          this.beneficiaryRelationID = undefined;
          let fname = response[0].firstName ? response[0].firstName : "";
          let lname = response[0].lastName ? response[0].lastName : ""
          this.relationshipWith = 'Relationship with ' + fname + ' ' + lname;
        }

      }
    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');
      console.log('ERROR', err);
      console.log('Something Went Wrong in fetching Parent Data');
    })

  }
  // to Calculate the age on the basis of date of birth
  calculateAge(date) {
    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - newDate.getFullYear();
      const month = today.getMonth() - newDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < newDate.getDate())) {
        age--;
      }
      this.age = age;
    } else {
      this.age = undefined;
    }
  }
  ageFlag: boolean = false;
  // calculate date of birth on the basis of age
  calculateDOB(age) {
    if (age > 150) {
      this.ageFlag = true
    }
    else {
      this.ageFlag = false;
    }
    const today = new Date();
    const currentYear = today.getFullYear();
    if (age == "") {
      this.DOB = undefined;
    }
    else if (age == 0) {
      this.DOB = new Date();
    }
    else {
      this.DOB = new Date(today.setFullYear(currentYear - age));

    }
    // int parsing in decimal format
    // if (this.DOB) {
    //   this.DOB = new Date(this.DOB.getDate() + '/' + (this.DOB.getMonth() + 1) + '/' + (currentYear - parseInt(age, 10)))
    // } else {
    // this.DOB = new Date('' + (currentYear - parseInt(age, 10)));
    // }

    //this.renderer.setElementAttribute(this.input.nativeElement, 'readonly', 'readonly');

  }
  // to remove the readonly on double click
  // enableAge(data) {
  //   this.renderer.setElementAttribute(this.input.nativeElement, 'readonly', null);
  // }


  // NEW CODE 
  ageUnit: any;

  onAgeEntered(age) {
    let valueEntered = age;
    if (valueEntered) {
      if (valueEntered > 120 && this.ageUnit == 'Years') {
        // alert(`Age can only be set between Today to 120 Years`);
        this.age = null;

      } else {
        console.log('ageUnit', this.ageUnit);
        console.log(moment().subtract(this.ageUnit, valueEntered).toDate());
        this.DOB = moment().subtract(this.ageUnit, valueEntered).toDate();
      }

    }

  }

  onAgeUnitEntered() {
    console.log('ageUnit', this.ageUnit);

    if (this.age != null) { this.onAgeEntered(this.age); }
  }

  dobChangeByCalender(dobval) {
    const date = new Date(this.DOB);
    console.log(this.BeneficaryCreationForm.value.dateOfBirth)

    if (dobval != undefined) {

      const dateDiff = Date.now() - date.getTime();
      const age = new Date(dateDiff);
      const yob = Math.abs(age.getFullYear() - 1970);
      const mob = Math.abs(age.getMonth());
      const dob = Math.abs(age.getDate() - 1);
      if (yob > 0) {
        this.BeneficaryCreationForm.form.patchValue({ age: yob });
        this.BeneficaryCreationForm.form.patchValue({ ageUnit: 'Years' });
        // this.ageUnit='Years';
      } else if (mob > 0) {
        this.BeneficaryCreationForm.form.patchValue({ age: mob });
        this.BeneficaryCreationForm.form.patchValue({ ageUnit: 'Months' });
        // this.ageUnit='Months';
      } else if (dob > 0) {
        this.BeneficaryCreationForm.form.patchValue({ age: dob });
        this.BeneficaryCreationForm.form.patchValue({ ageUnit: 'Days' });
        // this.ageUnit='Days';
      }
      if (date.setHours(0, 0, 0, 0) == this.today.setHours(0, 0, 0, 0)) {
        this.BeneficaryCreationForm.form.patchValue({ age: 1 });
        this.BeneficaryCreationForm.form.patchValue({ ageUnit: 'Days' });
      }


    } else if (dobval == 'Invalid date') {
      this.BeneficaryCreationForm.form.patchValue({ dob: null });
      this.DOB = null;
      alert('Invalid date entered, please recheck');
    } else {
      this.BeneficaryCreationForm.form.patchValue({ age: null });
    }

  }


  // NEW CODE ENDS

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  // for advanced Search
  toggleSearch(data: any) {
    this.wentAwayMainScreen.emit();

    this.isAdvancedSearch = false;
    if (data === 'Search by Id') {
      this.searchValue = 'Advanced Search';
      this.calledEarlier = true;
    } else {
      this.searchValue = 'Search by Id';
      this.calledEarlier = false;
      this.showSearchResult = false;
    }
    this.registrationNo = "";
  }
  back1() {
    this.isAdvancedSearch = true;
    this.searchValue = 'Advanced Search';
    this.calledEarlier = true;
    this.showSearchResult = true;
  }
  /** Purpose: function to retrive beneficiaries based on the fileds entered */
  searchBeneficiary(values: any) {
    this._userBeneficiaryData.searchBenficiary(values).subscribe((response) => {
      if (response.statusCode === 5000) {
        console.log('Error advanced Search Something went wrong', );
        this.showSearchResult = false;
        this.isAdvancedSearch = false;
      } else {
        this.isAdvancedSearch = true;
        this.regHistoryList = response;
        this.showSearchResult = true;
        this.calledEarlier = true;
        this.searchValue = 'Advanced Search';
        console.log('Response advanced Search', response);

      }
    }, (err) => {
      this.alertMaessage.alert(err.errorMessage, 'error');

      console.log('Error advanced Search', err);
      this.showSearchResult = false;
      this.isAdvancedSearch = false;
    });

  }
  // Data has to come from the databanse
  validateID(idType: any) {
    switch (idType) {
      case 1:
        {
          this.idMaxValue = '14';
          this.patternID = /^\d{4}\d{4}\d{4}$/;
          this.idErrorText = 'Enter valid Aadhar Ex:XXXXXXXXXXXX';
          break;
        }
      case 2:
        {
          this.idMaxValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = 'Enter valid Voter ID  Ex:alphanumeric and min 6 letters';
          break;

        }
      case 3:
        {
          this.idMaxValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = 'Enter valid Driving Licence  Ex:alphanumeric';
          break;
        }
      case 4:
        {
          this.idMaxValue = '10';
          this.patternID = /^[A-Za-z0-9]{10}$/;
          this.idErrorText = 'Enter valid PAN  Ex:alphanumeric ';
          break;
        }
      case 5:
        {
          this.idMaxValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = 'Enter valid Passport No. Ex:alphanumeric';
          break;
        }
      case 6:
        {
          this.idMaxValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = 'Enter valid Ration No. Ex:alphanumeric';
          break;
        }
      default:
        this.idMaxValue = '14';
        this.patternID = /^\d{4}\s\d{4}\s\d{4}$/;
        this.idErrorText = 'Enter valid Aadhar Ex:XXXX XXXX XXXX';
        break;
    }
  }
  // genderFlag: any = true;

  genderchange(value) {
    if (value == '' || value == null) {
      this.genderErrFlag = true;
      // this.genderFlag = true;
    } else {
      this.genderErrFlag = false;
      // this.genderFlag = false;
    }


    //precautionary code
    if (this.regHistoryList.length === 0) {
      this.beneficiaryRelationID = 1;
    }
  }
  // used to pass data between Components
  sendData(data: any): void {
    // send message to subscribers via observable subject
    this.pass_data.sendData(data);
  }
  countSerial(event: any) {

  }
  reset() {
    this.BeneficaryForm.resetForm();
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
    this.btnDisabled = false;
    // let a = null;
    // this.age = "0";
    // this.calculateDOB("0");

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    //   this.subcriptionOutbound.unsubscribe();

  }
  // getLocationPerPincode(pincodeObj: any) {
  //   this.areaList = [];
  //   this.pincodeLocation.forEach((element: any) => {
  //     this.areaList.push(element['Taluk'] + ', ' + element['Districtname'] + ', ' + element['statename']);
  //   });
  //   if (this.areaList.length === 0) {
  //     this.data.openSnackBar('No Location Found', 'Please Try again');
  //     // this.areaList.push('Area Not Found');
  //   } else {
  //     this.data.openSnackBar(this.areaList.length + ' Locations Found', 'Please Select');
  //   }
  // }
  /** Purpose: function to retrive beneficiaries based on the fileds entered */



  /* 3 July,2018
	Author:Diamond Khanna
	Purpose: SMS sending */
  sendSMS(generated_ben_id, alternate_Phone_No?) {

    let sms_template_id = '';
    let smsTypeID = '';
    // below line has hardcoded content in else section; needs to be removed
    let currentServiceID = this.saved_data.current_serviceID ? this.saved_data.current_serviceID : 1;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Registration SMS'.toLowerCase()) {
                smsTypeID = response[i].smsTypeID;
                break;
              }
            }
          }
        }

        if (smsTypeID != '') {
          this._smsService.getSMStemplates(this.saved_data.current_service.serviceID,
            smsTypeID).subscribe(res => {
              if (res != undefined) {
                if (res.length > 0) {
                  for (let j = 0; j < res.length; j++) {
                    if (res[j].deleted === false) {
                      sms_template_id = res[j].smsTemplateID;
                      break;
                    }
                  }

                }

                if (smsTypeID != '') {
                  let reqObj = {
                    'alternateNo': alternate_Phone_No,
                    'beneficiaryRegID': generated_ben_id,
                    'createdBy': this.saved_data.uname,
                    'is1097': true,
                    'providerServiceMapID': this.saved_data.current_service.serviceID,
                    'smsTemplateID': sms_template_id,
                    'smsTemplateTypeID': smsTypeID
                    // "userID": 0
                  }

                  let arr = [];
                  arr.push(reqObj);

                  this._smsService.sendSMS(arr)
                    .subscribe(ressponse => {
                      console.log(ressponse, 'SMS Sent');
                      alert('SMS sent');
                    }, err => {
                      console.log(err, 'SMS not sent Error');
                    })
                }
              }
            }, err => {
              console.log(err, 'Error in fetching sms templates');
            })
        }



      }, err => {
        console.log(err, 'error while fetching sms types');
      })

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
