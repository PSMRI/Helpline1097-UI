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
  ctiHandlerURL: any = "";
  isCancelDisable: boolean = true;
  isClosureDisable: boolean = false;
  isPrevious: boolean = false;
  isNext: boolean = false
  @Input() current_language: any;
  currentlanguage: any;
  ReloadCall: boolean;
  StartNewCall: boolean;

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
  private current_campaign: any;

  data: any = this.getCommonData.Userdata;

  selectedBenData: any = {
    'id': '',
    'fname': '',
    'lname': '',
    'mob': ''
  };

  ngOnInit() {
    this.current_campaign = this.getCommonData.current_campaign;
    var idx = jQuery('.carousel-inner div.active').index();
    console.log("index", idx);
    let url = this.configService.getTelephonyServerURL() + "bar/cti_handler.php";
    console.log("url = " + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // if (idx > 1) {
    //   jQuery('#previous').attr('disabled', null);
    //   //  jQuery('#next').attr('disabled', 'disabled');
    // }
    // if (idx === 0) {
    //   jQuery('#previous').attr('disabled', 'disabled');
    // }
    // if (idx > 0) {
    //   jQuery('#next').attr('disabled', null);
    // }
    // if (idx === 4) {
    //   jQuery('#next').attr('disabled', 'disabled');
    // }

    // jQuery('#closureLink').on('click', function () {
    //   jQuery('#myCarousel').carousel(idx + 3);
    //   jQuery("#four").parent().find("a").removeClass('active-tab');
    //   jQuery("#four").find("a").addClass("active-tab");
    // });
    // jQuery('#cancelLink').on('click', function () {
    //   jQuery('#myCarousel').carousel(idx);
    //   jQuery("#one").parent().find("a").removeClass('active-tab');
    //   jQuery("#one").find("a").addClass("active-tab");
    // });



    /**
     * Commented by : neeraj (298657); Date: 27-06-2017
     */
    /*	jQuery('#one').on('click', function () {
        jQuery('#myCarousel').carousel(idx);
        jQuery(this).parent().find("a").removeClass('active-tab');
        jQuery(this).find("a").addClass("active-tab");
      });
      jQuery('#two').on('click', function () {
        jQuery('#myCarousel').carousel(idx + 1);
        jQuery(this).parent().find("a").removeClass('active-tab');
        jQuery(this).find("a").addClass("active-tab");
      });
      jQuery('#three').on('click', function () {
        jQuery('#myCarousel').carousel(idx + 2);
        jQuery(this).parent().find("a").removeClass('active-tab');
        jQuery(this).find("a").addClass("active-tab");
      });
      jQuery('#four').on('click', function () {
        jQuery('#myCarousel').carousel(idx + 3);
        jQuery(this).parent().find("a").removeClass('active-tab');
        jQuery(this).find("a").addClass("active-tab");
      });*/

    jQuery("#previous").on('click', function () {

      var idx = jQuery('.carousel-inner div.active').index();
      if (idx > 1) {
        jQuery('#previous').attr('disabled', null);
        //  jQuery('#next').attr('disabled', 'disabled');
      }
      if (idx === 0) {
        jQuery('#previous').attr('disabled', 'disabled');
      }
      if (idx > 0) {
        jQuery('#next').attr('disabled', null);
      }
      if (idx === 4) {
        jQuery('#next').attr('disabled', 'disabled');
      }

      console.log('chala with', idx);
      if (idx === 0) {
        console.log('chala')
        jQuery("#one").parent().find("a").removeClass('active-tab');
        jQuery("#one").find('a').addClass('active-tab');
      }
      if (idx === 1) {
        jQuery('#two').parent().find('a').removeClass('active-tab');
        jQuery('#two').find('a').addClass('active-tab');
      }
      if (idx === 2) {
        jQuery('#three').parent().find('a').removeClass('active-tab');
        jQuery('#three').find('a').addClass('active-tab');
      }
      if (idx === 3) {

        jQuery('#four').parent().find('a').removeClass('active-tab');
        jQuery('#four').find('a').addClass('active-tab');
      }
    });


    jQuery('#next').on('click', function () {
      var idx = jQuery('.carousel-inner div.active').index();
      console.log('chala with', idx);
      if (idx > 1) {
        jQuery('#previous').attr('disabled', null);
        //  jQuery('#next').attr('disabled', 'disabled');
      }
      if (idx === 0) {
        jQuery('#previous').attr('disabled', 'disabled');
      }
      if (idx > 0) {
        jQuery('#next').attr('disabled', null);
      }
      if (idx === 4) {
        jQuery('#next').attr('disabled', 'disabled');
      }

      if (idx === 0) {
        jQuery('#one').parent().find('a').removeClass('active-tab');
        jQuery('#one').find('a').addClass('active-tab');

      }
      if (idx === 1) {
        jQuery('#two').parent().find('a').removeClass('active-tab');
        jQuery('#two').find('a').addClass('active-tab');

      }
      if (idx === 2) {
        jQuery('#three').parent().find('a').removeClass('active-tab');
        jQuery('#three').find('a').addClass('active-tab');

      }
      if (idx === 3) {
        jQuery('#four').parent().find('a').removeClass('active-tab');
        jQuery('#four').find('a').addClass('active-tab');
      }
    });

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
    // this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': [''] } }]);
  }


  // tslint:disable-next-line:use-life-cycle-interface
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

  getSelectedBenDetails(data: any) {/**Code commented by neeraj 23 jun 2017 
		console.log( 'data recieved', data, data.beneficiaryRegID );
		this.beneficiaryNotSelected = false;
		this.updateClosureData.emit();
		this.serviceProvided.emit();
		this.beneficiarySelected.emit();
		this.selectedBenData.id = "BEN" + data.beneficiaryRegID;
		this.selectedBenData.fname = data.firstName;
		this.selectedBenData.lname = data.lastName;
		this.selectedBenData.mob = data.phoneNo;
*/
    /**
         * Neeraj Code; 22-jun-2017
         */
    //	this.beneficiaryNotSelected = false;
    //	this.updateClosureData.emit();
    //	this.serviceProvided.emit();
    //	this.beneficiarySelected.emit();

    if (data != null) {
      //alert(" hai");
      this.selectedBenData.id = data.beneficiaryRegID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
    } else {
      //	alert("nahi hai");
      this.selectedBenData.id = '';
      this.selectedBenData.fname = '';
      this.selectedBenData.lname = '';
    }
    this.beneficiarySelected.emit(data);

    /**
     * End of Neeraj Code; 22-jun-2017
     */


  }

  startNewCall() {
    this.StartNewCall = true;
    // this.StartNewCall.emit();
    // document.getElementById('cancelLink').click();
  }
  reloadCall() {
    this.ReloadCall = true;
    // this.ReloadCall.emit();
  }

  refreshCall() {

  }

  updateServiceProvided(data: any) {
    this.serviceProvided.emit(null);
  }
  // 	change(no:any){

  // if (no === '1') {

  // 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['registerBeneficiary'] } }]);
  // }
  // if (no === '2') {
  // 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['servicesForBeneficiary'] } }]);
  // }
  // if (no === '3') {
  // 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['updates'] } }]);
  // }
  // if (no === '4') {
  // 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['closure'] } }]);
  //    }

  // 	}

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


  nxtVisual()
  {
    var idx = jQuery('.carousel-inner div.active').index();
    console.log('chala with', idx);
    // if (idx > 1) {
    //   jQuery('#previous').attr('disabled', null);
    //   //  jQuery('#next').attr('disabled', 'disabled');
    // }
    // if (idx === 0) {
    //   jQuery('#previous').attr('disabled', 'disabled');
    // }
    // if (idx > 0) {
    //   jQuery('#next').attr('disabled', null);
    // }
    // if (idx === 4) {
    //   jQuery('#next').attr('disabled', 'disabled');
    // }

    // if (idx === 0) {
    //   jQuery('#one').parent().find('a').removeClass('active-tab');
    //   jQuery('#one').find('a').addClass('active-tab');

    // }
    if (idx === 1) {
      jQuery('#three').parent().find('a').removeClass('active-tab');
      jQuery('#three').find('a').addClass('active-tab');

    }
    if (idx === 2) {
      jQuery('#four').parent().find('a').removeClass('active-tab');
      jQuery('#four').find('a').addClass('active-tab');

    }
    // if (idx === 3) {
    //   jQuery('#four').parent().find('a').removeClass('active-tab');
    //   jQuery('#four').find('a').addClass('active-tab');
    // }
  }

}
