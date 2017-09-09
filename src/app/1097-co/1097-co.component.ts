import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ViewContainerRef, AfterViewInit, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router'
declare var jQuery: any;
import { CommunicationService } from './../services/common/communication.service'

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
  barMinimized: boolean = true;
  ctiHandlerURL: any = '';
  isCancelDisable: boolean = true;
  isClosureDisable: boolean = false;
  isPrevious: boolean = false;
  isNext: boolean = false
  @Input() current_language: any;
  currentlanguage: any;
  ReloadCall: boolean;
  StartNewCall: boolean;
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
    private pass_data: CommunicationService
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



    // jQuery('#previous').on('click', function () {
    //   var idx = jQuery('.carousel-inner div.active').index();
    //   if (idx > 1) {
    //     jQuery('#previous').attr('disabled', null);
    //     //  jQuery('#next').attr('disabled', 'disabled');
    //   }
    //   if (idx === 0) {
    //     jQuery('#previous').attr('disabled', 'disabled');
    //   }
    //   if (idx > 0) {
    //     jQuery('#next').attr('disabled', null);
    //   }
    //   if (idx === 4) {
    //     jQuery('#next').attr('disabled', 'disabled');
    //   }
    //   if (idx === 2) {
    //     this.isNext = true;
    //     this.isPrevious = true;
    //   }
    //   if (idx === 3) {
    //     this.isNext = false;
    //     this.isPrevious = true;
    //   }
    //   console.log('chala with', idx);
    //   if (idx === 0) {
    //     console.log('chala')
    //     jQuery('#one').parent().find('a').removeClass('active-tab');
    //     jQuery('#one').find('a').addClass('active-tab');
    //   }
    //   if (idx === 1) {
    //     jQuery('#two').parent().find('a').removeClass('active-tab');
    //     jQuery('#two').find('a').addClass('active-tab');
    //   }
    //   if (idx === 2) {
    //     jQuery('#three').parent().find('a').removeClass('active-tab');
    //     jQuery('#three').find('a').addClass('active-tab');
    //   }
    //   if (idx === 3) {

    //     jQuery('#four').parent().find('a').removeClass('active-tab');
    //     jQuery('#four').find('a').addClass('active-tab');
    //   }
    // });


    // jQuery('#next').on('click', function () {
    //   var idx = jQuery('.carousel-inner div.active').index();
    //   console.log('chala with', idx);
    //   if (idx > 1) {
    //     jQuery('#previous').attr('disabled', null);
    //     //  jQuery('#next').attr('disabled', 'disabled');
    //   }
    //   if (idx === 0) {
    //     jQuery('#previous').attr('disabled', 'disabled');
    //   }
    //   if (idx > 0) {
    //     jQuery('#next').attr('disabled', null);
    //   }
    //   if (idx === 4) {
    //     jQuery('#next').attr('disabled', 'disabled');
    //   }
    //   if (idx === 2) {
    //     this.isNext = true;
    //     this.isPrevious = true;
    //   }
    //   if (idx === 3) {
    //     this.isNext = false;
    //     this.isPrevious = true;
    //   }

    //   if (idx === 0) {
    //     jQuery('#one').parent().find('a').removeClass('active-tab');
    //     jQuery('#one').find('a').addClass('active-tab');

    //   }
    //   if (idx === 1) {
    //     jQuery('#two').parent().find('a').removeClass('active-tab');
    //     jQuery('#two').find('a').addClass('active-tab');

    //   }
    //   if (idx === 2) {
    //     jQuery('#three').parent().find('a').removeClass('active-tab');
    //     jQuery('#three').find('a').addClass('active-tab');

    //   }
    //   if (idx === 3) {
    //     jQuery('#four').parent().find('a').removeClass('active-tab');
    //     jQuery('#four').find('a').addClass('active-tab');
    //   }
    // });

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

  ngOnChanges() {
    this.setLanguage(this.current_language);
  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language in 1097 co me');
  }
  closedContinue() {
    this.startNewCall();
    const id = jQuery('.carousel-inner div.active').index();
    jQuery('#myCarousel').carousel(0);
    jQuery('#one').parent().find('a').removeClass('active-tab');
    jQuery('#one').find('a').addClass('active-tab');
    this.isCancelDisable = true;
    this.isClosureDisable = false;
    this.isNext = false;

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

  startNewCall() {
    this.StartNewCall = true;

  }
  reloadCall() {
    this.ReloadCall = true;

  }

  refreshCall() {

  }

  updateServiceProvided(data: any) {
    this.serviceProvided.emit(null);
  }


  minimizeBar() {
    this.barMinimized = true;
  }
  toggleBar() {
    this.barMinimized = !this.barMinimized;
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
    this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard']);
  }
  openDialog() {
    this.dialogService.confirm('Cancel Call ', 'Are you sure want to Cancel ?').subscribe((response) => {
      if (response) {
        this.reloadCall();
        this.beneficiarySelected.emit(null);
        const id = jQuery('.carousel-inner div.active').index();
        jQuery('#myCarousel').carousel(0);
        jQuery('#one').parent().find('a').removeClass('active-tab');
        jQuery('#one').find('a').addClass('active-tab');
        this.isCancelDisable = true;
        this.isClosureDisable = false;
        this.isNext = false;
      }
    });
  }
  openDialogClosure() {
    this.dialogService.confirm('Closure ', 'Are you sure want to Close the Call ?').subscribe((response) => {
      if (response) {
        jQuery('#myCarousel').carousel(3);
        jQuery('#four').parent().find('a').removeClass('active-tab');
        jQuery('#four').find('a').addClass('active-tab');
        this.isClosureDisable = true;
        this.isCancelDisable = false;
        this.isNext = false;
      }
    });
  }
  getServiceHistory() {
    this.getHistory.emit(null);
  }
  public callBenOutbound(event: any) {
    this.getCommonData.current_campaign = 'INBOUND';
    this.current_campaign = this.getCommonData.current_campaign;
    this.getSelectedBenDetails(event.beneficiary);
    this.benService('benService');
    this.pass_data.sendData(event.beneficiary);
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

}
