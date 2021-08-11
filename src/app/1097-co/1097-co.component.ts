import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ViewContainerRef, AfterViewInit, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router'
declare var jQuery: any;
import { CommunicationService } from './../services/common/communication.service';
import { OutboundService } from './../services/common/outbound.services';
import { ReloadService } from './../services/common/reload.service';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { CollapseDirective } from './../directives/collapse/collapse.directive'
import { ClearFormService } from './../services/common/clearform.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";
@Component({
  selector: 'app-1097-co',
  templateUrl: './1097-co.component.html',
  styleUrls: ['./1097-co.component.css']
})
export class helpline1097CoComponent implements OnInit {
  callDuration: number = 0;
  beneficiaryNotSelected: boolean = true;
  callerNumber: any;
  callID: any;
  barMinimized: any = 'false';
  ctiHandlerURL: any = '';
  isCancelDisable: boolean = true;
  isClosureDisable: boolean = false;
  isPrevious: boolean = false;
  isNext: boolean = false
  @Input() current_language: any;
  currentlanguage: any;
  resetProvideServices: any;
  disableBack: boolean;
  private current_campaign: any;

  data: any = this.getCommonData.Userdata;
  @Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
  // @Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() everwellBeneficiarySelected: EventEmitter<any> = new EventEmitter<any>();  
  @Output() getHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitBtnCheck : EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('cancel') cancel;
  submitCheck: boolean;
  currentLanguageSet: any;

  constructor(
    public getCommonData: dataService,
    public basicrouter: Router,
    public router: ActivatedRoute,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private dialogService: ConfirmationDialogsService,
    private _viewContainerRef: ViewContainerRef,
    private pass_data: CommunicationService,
    private outBoundService: OutboundService,
    private reloadCall: ReloadService,
    private czentrixService: CzentrixServices,
    private ClearForm: ClearFormService,public HttpServices: HttpServices
  ) {
    setInterval(() => {
      this.callDuration = this.callDuration + 1;
    }, 1000);
    this.getCommonData.beneficiarySelected.subscribe((data) => {
      this.setFlag(data)
    });

  }


  // tslint:disable-next-line:member-ordering
  selectedBenData: any = {
    'id': '',
    'fname': '',
    'lname': '',
    'mob': ''
  };
  isEverwell:string;
  ngOnInit() {
    this.current_campaign = this.getCommonData.current_campaign;
    var idx = jQuery('.carousel-inner div.active').index();
    let url = this.configService.getTelephonyServerURL() + 'bar/cti_handler.php';
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    if (sessionStorage.getItem("CLI") !== undefined) {​​​​​​​​
      this.callerNumber = sessionStorage.getItem("CLI");
      this.getCommonData.callerNumber = this.callerNumber;
          }​​​​​​​​
      if (sessionStorage.getItem("session_id") !== undefined) {​​​​​​​
            this.getCommonData.callID =sessionStorage.getItem("session_id");
           
          }
    // this.router.params.subscribe((params: Params) => {
    //   if (params['mobileNumber'] != undefined) {
    //     this.callerNumber = parseInt(params['mobileNumber']);
    //     this.getCommonData.callerNumber = this.callerNumber;
    //   }
    //   if (params['callID'] != undefined) {
    //     this.callID = params['callID'];
    //     this.getCommonData.callID = this.callID;
    //   }

    // });
    this.disableBack = true;
    this.isEverwell = sessionStorage.getItem("isEverwellCall");

    this.submitCheck = this.getCommonData.checkEverwellResponse;
    console.log("submitCheck", this.submitCheck);
    
    console.log('isEverwell'+this.isEverwell);    
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  /*experiment*/
  // f:boolean=true;
  // toggleVAL()
  // {
  //   this.getCommonData.reset_flag=!(this.f);
  // }

  /*experiment*/
  OUT: boolean;
  ngOnChanges() {
    this.submitCheck = this.getCommonData.checkEverwellResponse;
    console.log("submitCheckOn", this.submitCheck);
    this.setLanguage(this.current_language);
    if (this.getCommonData.current_campaign == 'OUTBOUND') {
      this.OUT = true;
    }
    else {
      this.OUT = false;
    }
  }

  setLanguage(language) {
    this.currentlanguage = language;
  }
  closedContinue() {
    // this.startNewCall();
    this.ReloadBenOutbound('startcall');
    const id = jQuery('.carousel-inner div.active').index();
    jQuery('#myCarousel').carousel(0);
    jQuery('#one').parent().find('a').removeClass('active-tab');
    jQuery('#one').find('a').addClass('active-tab');
    this.isCancelDisable = true;
    this.isClosureDisable = false;
    this.isNext = false;
    this.isPrevious = false;

  }

  addActiveClass(val: any) {
    jQuery('#' + val).parent().find('a').removeClass('active-tab');
    jQuery('#' + val).find('a').addClass('active-tab');
  }

  getSelectedBenDetails(data: any) {

    if (data != null) {

      this.selectedBenData.id = data.beneficiaryID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
    } else {

      this.selectedBenData.id = '';
      this.selectedBenData.fname = '';
      this.selectedBenData.lname = '';
    }
    this.beneficiarySelected.emit(data);



  }

  getEverwellSelectedBenDetails(data: any) {
    // if (data != null) {

    //   this.selectedBenData.id = data.beneficiaryID;
    //   this.selectedBenData.fname = data.firstName;
    //   this.selectedBenData.lname = data.lastName;
    // } else {

    //   this.selectedBenData.id = '';
    //   this.selectedBenData.fname = '';
    //   this.selectedBenData.lname = '';
    // }
    console.log('1097co174' + data);
    
    this.everwellBeneficiarySelected.emit(data);
  }

  // startNewCall() {
  //   this.StartNewCall = true;

  // }
  // reloadCall() {
  //   // this.ReloadCall = true;

  // }

  refreshCall() {

  }

  updateServiceProvided(data: any) {
    this.serviceProvided.emit(null);
  }


  minimizeBar() {
    this.barMinimized = 'false';
  }
  toggleBar() {
    // this.barMinimized = !this.barMinimized;
    if (this.barMinimized === 'true') {
      this.barMinimized = 'false';
    }
    else {
      this.barMinimized = 'true';
    }
  }
  benService(data) {

    // alert(this.getCommonData.benRegId);
    if (data === 'benService') {
      jQuery('#myCarousel').carousel(1);
      jQuery('#two').parent().find('a').removeClass('active-tab');
      jQuery('#two').find('a').addClass('active-tab');
      // jQuery('#second').addClass('item active');
      this.isNext = true;
      this.isCancelDisable = false;
      this.resetProvideServices = '5';
    }

  }

  closeCall(compain_type: any) {
    this.getCommonData.current_campaign = compain_type;
    this.getCommonData.isCallDisconnected = false;
    sessionStorage.removeItem('isOnCall');
    sessionStorage.removeItem('isEverwellCall');

    this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard'], { queryParams: { compain: compain_type } });
  }
  openDialog() {

    this.dialogService.confirm('Cancel Call ', 'Do you want to cancel?').subscribe((response) => {
      if (response) {
        this.resetProvideServices = '2';
        // this.reloadCall();
        //   this.beneficiarySelected.emit(null);
        const id = jQuery('.carousel-inner div.active').index();
        jQuery('#myCarousel').carousel(0);
        jQuery('#one').parent().find('a').removeClass('active-tab');
        jQuery('#one').find('a').addClass('active-tab');
        jQuery('#btnClosure').attr('disabled', null);
        // jQuery('#benForm').trigger('reset');
        // jQuery('#closeForm').trigger('reset');
        this.ClearForm.clearFormSender('closure');
        // jQuery('#otherDetailsForm').trigger('reset');
        this.isCancelDisable = true;
        this.isClosureDisable = false;
        this.isNext = false;
        this.isPrevious = false;
        this.ReloadBenOutbound('reloadcall');
      }
    });

  }
  openEverwellDialog() {

    this.dialogService.confirm('Cancel Call ', 'Do you want to cancel?').subscribe((response) => {
      if (response) {
        this.resetProvideServices = '2';
        // this.reloadCall();
        //   this.beneficiarySelected.emit(null);
        const id = jQuery('.carousel-inner div.active').index();
        jQuery('#myCarouselEverwell').carousel(0);
        jQuery('#one').parent().find('a').removeClass('active-tab');
        jQuery('#one').find('a').addClass('active-tab');
        jQuery('#btnClosure').attr('disabled', null);
        // jQuery('#benForm').trigger('reset');
        // jQuery('#closeForm').trigger('reset');
        this.ClearForm.clearFormSender('closure');
        // jQuery('#otherDetailsForm').trigger('reset');
        this.isCancelDisable = true;
        this.isClosureDisable = false;
        this.isNext = false;
        this.isPrevious = false;
        this.ReloadBenOutbound('reloadcall');
      }
    });

  }
  openDialogClosure() {

    this.dialogService.confirm('Closure ', 'Do you want to close the call?').subscribe((response) => {
      if (response) {
        this.resetProvideServices = '3';
        jQuery('#myCarousel').carousel(3);
        jQuery('#four').parent().find('a').removeClass('active-tab');
        jQuery('#four').find('a').addClass('active-tab');
        this.isClosureDisable = true;
        this.isCancelDisable = false;
        this.isNext = false;
        this.isPrevious = true;
      }
    });

  }

  openEverwellDialogClosure() {

    this.dialogService.confirm('Closure ', 'Do you want to close the call?').subscribe((response) => {
      if (response) {
        this.resetProvideServices = '3';
        jQuery('#myCarouselEverwell').carousel(1);
        jQuery('#four').parent().find('a').removeClass('active-tab');
        jQuery('#four').find('a').addClass('active-tab');
        this.isClosureDisable = true;
        this.isCancelDisable = false;
        this.isNext = false;
        this.isPrevious = true;
      }
    });

  }
  getServiceHistory() {
    this.getHistory.emit(null);
  }
  // public callBenOutbound(event: any) {
  //   // this.getSelectedBenDetails(event.beneficiary);
  //   // this.benService('benService');
  //   this.czentrixService.getIpAddress(this.getCommonData.cZentrixAgentID)
  //     .subscribe((ipAddressresponse) => {
  //       let cZentrixIp = ipAddressresponse.response.agent_ip;
  //       if (!cZentrixIp) {
  //         cZentrixIp = this.getCommonData.loginIP;
  //       }
  //       this.outboundEvent(event, cZentrixIp)
  //     },
  //       (error) => {
  //         this.dialogService.alert('Some error while calling Czentrix', 'error');
  //       });
  // }  NO longer in use after implementing routing for outbound worklist.... gursimran 29/5/18

  // public outboundEvent(event: any, IpAddress: any) {
  //   const params = 'transaction_id=CTI_DIAL&agent_id=' + this.getCommonData.cZentrixAgentID +
  //     '&ip=' + IpAddress + '&phone_num=' + event.beneficiary.benPhoneMaps[0].phoneNo +
  //     '&resFormat=3';
  //   this.czentrixService.callAPI(params)
  //     .subscribe((res) => {
  //       if (res.response.status == 'SUCCESS') {
  //         this.getCommonData.current_campaign = 'INBOUND';
  //         this.current_campaign = this.getCommonData.current_campaign;
  //         this.basicrouter.navigate(['/InnerpageComponent']);
  //         this.outBoundService.sendOutboundData(event);
  //       } else {
  //         this.dialogService.alert('Czentrix user not logged-in');
  //       }
  //     },
  //       (error) => {
  //         this.dialogService.alert('Call not intiating, Please try again.');
  //       });
  // } NO longer in use after implementing routing for outbound worklist.... gursimran 29/5/18
  public ReloadBenOutbound(callType) {
    this.reloadCall.sendReloadCall(callType);
  }
  nxtVisual() {
    this.resetProvideServices = '4';
    var idx = jQuery('.carousel-inner div.active').index();
    if (idx === 1) {
      jQuery('#three').parent().find('a').removeClass('active-tab');
      jQuery('#three').find('a').addClass('active-tab');
      this.isNext = true;
      this.isPrevious = true;
    }
    if (idx === 2) {
      jQuery('#four').parent().find('a').removeClass('active-tab');
      jQuery('#four').find('a').addClass('active-tab');
      this.isNext = false;
      this.isPrevious = true;
    }

  }
  prevVisual() {
    this.resetProvideServices = '1';
    var idx = jQuery('.carousel-inner div.active').index();
    this.isClosureDisable = false;

    if (idx === 2) {
      jQuery('#two').parent().find('a').removeClass('active-tab');
      jQuery('#two').find('a').addClass('active-tab');
      this.isNext = true;
      this.isPrevious = false;

    }
    if (idx === 3) {
      jQuery('#three').parent().find('a').removeClass('active-tab');
      jQuery('#three').find('a').addClass('active-tab');
      this.isNext = true;
      this.isPrevious = true;

    }

  }
  CancelDisable() {
    this.isCancelDisable = false;
  }
  setFlag(data) {
    this.disableBack = !data.beneficiarySelected;
  }
  changeSubmitFlag(submitFlag){
    this.submitCheck = submitFlag;
    this.submitBtnCheck.emit(submitFlag);
    console.log("submitflag",submitFlag);
     
  }
}
