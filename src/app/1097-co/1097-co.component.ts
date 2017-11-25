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
  private current_campaign: any;

  data: any = this.getCommonData.Userdata;
  @Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
  // @Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() getHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('cancel') cancel;

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
    private ClearForm: ClearFormService
  ) {
    setInterval(() => {
      this.callDuration = this.callDuration + 1;
    }, 1000);
  }


  // tslint:disable-next-line:member-ordering
  selectedBenData: any = {
    'id': '',
    'fname': '',
    'lname': '',
    'mob': ''
  };

  ngOnInit() {
    this.current_campaign = this.getCommonData.current_campaign;
    var idx = jQuery('.carousel-inner div.active').index();
    console.log('index', idx);
    let url = this.configService.getTelephonyServerURL() + 'bar/cti_handler.php';
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);


    this.router.params.subscribe((params: Params) => {
      if (params['mobileNumber'] != undefined) {
        this.callerNumber = parseInt(params['mobileNumber']);
        console.log(' this.callerNumber:' + this.callerNumber);
        this.getCommonData.callerNumber = this.callerNumber;
      }
      if (params['callID'] != undefined) {
        this.callID = params['callID'];
        console.log(' this.callID:' + this.callID);
        this.getCommonData.callID = this.callID;
      }

    });
  }


/*experiment*/
  // f:boolean=true;
  // toggleVAL()
  // {
  //   this.getCommonData.reset_flag=!(this.f);
  // }

  /*experiment*/

  ngOnChanges() {
    this.setLanguage(this.current_language);
  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language in 1097 co me');
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

      this.selectedBenData.id = data.beneficiaryRegID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
    } else {

      this.selectedBenData.id = '';
      this.selectedBenData.fname = '';
      this.selectedBenData.lname = '';
    }
    this.beneficiarySelected.emit(data);



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
      this.isNext = true;
      this.isCancelDisable = false;
    }

  }

  closeCall(compain_type: any) {
    this.getCommonData.current_campaign = compain_type;
    this.getCommonData.isCallDisconnected = false;
    this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard'], { queryParams: { compain: compain_type } });
  }
  openDialog() {
    this.dialogService.confirm('Cancel Call ', 'Cancel Call?').subscribe((response) => {
      if (response) {
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
        //jQuery('#otherDetailsForm').trigger('reset');
        this.isCancelDisable = true;
        this.isClosureDisable = false;
        this.isNext = false;
        this.isPrevious = false;
        this.ReloadBenOutbound('reloadcall');
      }
    });
  }
  openDialogClosure() {
    this.dialogService.confirm('Closure ', 'Close Call ?').subscribe((response) => {
      if (response) {
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
  getServiceHistory() {
    this.getHistory.emit(null);
  }
  public callBenOutbound(event: any) {
    // this.getSelectedBenDetails(event.beneficiary);
    // this.benService('benService');
    this.czentrixService.getIpAddress(this.getCommonData.cZentrixAgentID)
      .subscribe((ipAddressresponse) => {
        let cZentrixIp = ipAddressresponse.response.agent_ip;
        if (!cZentrixIp) {
          cZentrixIp = this.getCommonData.loginIP;
        }
        this.outboundEvent(event, cZentrixIp)
      },
      (error) => {
        this.dialogService.alert('Some Error while calling Czentrix.');
      });
  }

  public outboundEvent(event: any, IpAddress: any) {
    const params = 'transaction_id=CTI_DIAL&agent_id=' + this.getCommonData.cZentrixAgentID +
      '&ip=' + IpAddress + '&phone_num=' + event.beneficiary.benPhoneMaps[0].phoneNo +
      '&resFormat=3';
    this.czentrixService.callAPI(params)
      .subscribe((res) => {
        console.log(res);
        if (res.response.status == 'SUCCESS') {
          this.getCommonData.current_campaign = 'INBOUND';
          this.current_campaign = this.getCommonData.current_campaign;
          this.basicrouter.navigate(['/InnerpageComponent']);
          this.outBoundService.sendOutboundData(event);
        } else {
          this.dialogService.alert('Czentrix user not logged In.');
        }
      },
      (error) => {
        this.dialogService.alert('Call Not Intiating Please try again.');
      });
  }
  public ReloadBenOutbound(callType) {
    this.reloadCall.sendReloadCall(callType);
  }
  nxtVisual() {
    var idx = jQuery('.carousel-inner div.active').index();
    console.log('chala with', idx);

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
    var idx = jQuery('.carousel-inner div.active').index();
    console.log('chala with', idx);

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

}
