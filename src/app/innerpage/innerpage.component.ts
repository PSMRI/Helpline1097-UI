import { Component, OnInit, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router'
import { ConfigService } from '../services/config/config.service';
import { HttpServices } from '../services/http-services/http_services.service';
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CallServices } from '../services/callservices/callservice.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { Observable } from "rxjs/Rx";
declare const jQuery: any;


@Component({
  selector: 'app-innerpage',
  templateUrl: './innerpage.component.html',
  styleUrls: ['./innerpage.component.css']
})
export class InnerpageComponent implements OnInit {
  callDuration: string = '';
  beneficiaryNotSelected: boolean = true;
  callerNumber: any;
  barMinimized: boolean = true;
  startYear: number = 1970;
  checkRole = true;
  seconds: number = 0;
  minutes: number = 0;
  counter: number = 0;
  current_campaign: any;
  eventSpiltData: any;
  // language change stuff
  languageFilePath: any = 'assets/language.json';
  selectedlanguage: any = '';
  currentlanguageSet: any = {};
  language_change: any;
  beneficiaryRegID: any;
  providerServiceMapId: any;
  timeRemaining: number = 3;
  ticks: any;
  callStatus: any;
  callTime: boolean = true;
  wrapupTime: boolean = false;
  TotalCalls: any;
  TotalTime: any;

  // eventSpiltData: any;


  @Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
  @Output() StartNewCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  current_service: any;
  current_role: any;
  loginUrl = this._config.getCommonLoginUrl();
  data: any = {};
  ctiHandlerURL: any;
  validCallID: any;
  listenCallEvent: any;
  constructor(
    public getCommonData: dataService,
    private _callServices: CallServices,
    public basicrouter: Router,
    public router: ActivatedRoute,
    public HttpServices: HttpServices,
    public http: Http,
    public sanitizer: DomSanitizer,
    private _config: ConfigService,
    private remarksMessage: ConfirmationDialogsService,
    private renderer: Renderer,
    private Czentrix: CzentrixServices

  ) {
    this.currentlanguageSet = [];

  }



  // tslint:disable-next-line:member-ordering
  selectedBenData: any = {
    'id': '',
    'fname': '',
    'lname': '',
    'mob': '',
    'age': '',
    'gender': '',
    'state': '',
    'district': '',
    'block': '',
    'village': '',
    'language': '',
    'relation': '',
    'name': ''
  };

  ngOnInit() {
    this.data = this.getCommonData.Userdata;

    this.providerServiceMapId = this.getCommonData.current_service.serviceID;

    const url = this._config.getTelephonyServerURL() + 'bar/cti_handler.php';
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.router.params.subscribe((params: Params) => {
      if (params['mobileNumber'] != undefined) {
        // tslint:disable-next-line:radix
        this.callerNumber = parseInt(params['mobileNumber']);
        console.log(' this.callerNumber:' + this.callerNumber);
        console.log(this.current_service + ':' + this.current_role);
      }
    });
    this.getCallTypes(this.providerServiceMapId);
    this.language_change = 'english';
    this.getLanguageObject(this.language_change);

    this.current_service = this.getCommonData.current_service.serviceName;
    this.current_role = this.getCommonData.current_role.RoleName;
    if (this.current_role.toLowerCase() === 'supervisor') {
      this.checkRole = false;
    }
    this.callDuration = this.minutes + 'm ' + this.seconds + 's ';
    setInterval(() => {
      // Get todays date and time
      if (this.seconds === (this.counter + 60)) {
        this.minutes = this.minutes + 1;
        this.seconds = 0;
      }
      this.seconds = this.seconds + 1;
      this.callDuration = this.minutes + 'm ' + this.seconds + 's ';
    }, 1000);
    this.current_campaign = this.getCommonData.current_campaign;
    this.listenCallEvent = this.renderer.listenGlobal('window', 'message', (event) => {
      this.listener(event);
      // Do something with 'event'
    });
    // this.addListener();
    this.getAgentStatus();
    this.getAgentCallDetails();
  }
  addActiveClass(val: any) {
    jQuery('#' + val).parent().find('a').removeClass('active-tab');
    jQuery('#' + val).find('a').addClass('active-tab');
  }

  getSelectedBenDetails(data: any) {
    if (data != null) {
      this.selectedBenData.id = 'Ben ID: ' + data.beneficiaryRegID;
      this.beneficiaryRegID = data.beneficiaryRegID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
      this.selectedBenData.name = 'Name: ' + data.firstName + ' ' + data.lastName;
      // if ( data.dOB )
      // {
      //  let currDate = new Date();
      //  let dob = new Date( data.dOB );
      //  let age = new Date( currDate.getTime() - dob.getTime() ).getFullYear() - this.startYear;
      this.selectedBenData.age = 'Age: ' + data.age;
      // }
      this.selectedBenData.gender = 'Gender: ' + (data.m_gender ? (data.m_gender.genderName ? data.m_gender.genderName : "") : "");
      this.selectedBenData.state = 'State: ' + (data.i_bendemographics ? (data.i_bendemographics.m_state ? (data.i_bendemographics.m_state.stateName ? data.i_bendemographics.m_state.stateName : "") : "") : "");
      this.selectedBenData.district = 'District: ' + (data.i_bendemographics ? (data.i_bendemographics.m_district ? (data.i_bendemographics.m_district.districtName ? data.i_bendemographics.m_district.districtName : "") : '') : '');
      this.selectedBenData.block = 'Taluk: ' + (data.i_bendemographics ? (data.i_bendemographics.m_districtblock ? (data.i_bendemographics.m_districtblock.blockName ? data.i_bendemographics.m_districtblock.blockName : "") : "") : "");
      this.selectedBenData.village = 'Village: ' + (data.i_bendemographics ? (data.i_bendemographics.m_districtbranchmapping ? (data.i_bendemographics.m_districtbranchmapping.villageName ? data.i_bendemographics.m_districtbranchmapping.villageName : "") : "") : "");
      this.selectedBenData.language = 'Preferred Lang: ' + (data.i_bendemographics ? (data.i_bendemographics.m_language ? (data.i_bendemographics.m_language.languageName ? data.i_bendemographics.m_language.languageName : "") : "") : "");
      this.selectedBenData.relation = 'Family tagging: ' + (data.benPhoneMaps[0] ? (data.benPhoneMaps[0].benRelationshipType ? (data.benPhoneMaps[0].benRelationshipType.benRelationshipType) : "") : "");
    } else {
      this.selectedBenData.name = '';
      this.selectedBenData.id = '';
      this.selectedBenData.fname = '';
      this.selectedBenData.lname = '';
      this.selectedBenData.age = '';
      this.selectedBenData.gender = '';
      this.selectedBenData.state = '';
      this.selectedBenData.district = '';
      this.selectedBenData.block = '';
      this.selectedBenData.village = '';
      this.selectedBenData.language = '';
      this.selectedBenData.relation = '';
    }
  }


  minimizeBar() {
    this.barMinimized = true;
  }
  toggleBar() {
    this.barMinimized = !this.barMinimized;

  }
  calculateTimeDuration() {

    // Update the count down every 1 secon

  }

  // language change stuff
  getLanguageObject(language) {
    this.selectedlanguage = language;
    console.log('language asked for is:', language);
    this.HttpServices.getData(this.languageFilePath).subscribe(response => this.successhandeler(response, language));

  }

  successhandeler(response, language) {
    console.log('language triggered and recieved', response, language);
    this.currentlanguageSet = response[language];
    // this.currentlanguageSet = "LANGUAGE IS ENGLISH PEHLI BAAR ME";
  }
  logOut() {
    // Cookie.deleteAll();
    this.basicrouter.navigate(['']);
    // location.assign(this.loginUrl);
  }
  // ngOnDestroy() {
  //   Cookie.deleteAll();
  // }

  // addListener() {
  //   if (window.parent.parent.addEventListener) {
  //     console.log('adding message listener');
  //     addEventListener('message', this.listener1.bind(this), false);
  //   } else {
  //     console.log('adding onmessage listener');
  //   }
  // }
  // removeEventListener() {
  //   if (window.parent.parent.removeEventListener) {
  //     console.log('adding message listener');
  //     addEventListener('message', null, false);
  //   } else {
  //     console.log('adding onmessage listener');
  //   }
  // }
  getCallTypes(providerServiceMapID) {
    const requestObject = { 'providerServiceMapID': providerServiceMapID };
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      console.log(response);
      this.validCallID = response.filter(function (item) {
        console.log(item.callGroupType);
        return item.callGroupType.toLowerCase() === 'valid'
      })[0].callTypes.filter(function (previousData) {
        console.log(previousData.callTypeDesc);
        return previousData.callTypeDesc.toLowerCase() === 'valid'
      })[0].callTypeID;
      console.log('valid call id', this.validCallID);
    }, (err) => {

    });

  }

  testEvent() {
    let event = new CustomEvent('message', {
      detail: {
        data: 'Disconnect|1505969514.3802000000',
        time: new Date(),
      },
      bubbles: true,
      cancelable: true
    });
    // document.dispatchEvent(event);

  }
  listener(event) {
    console.log('listener invoked: ' + event);
    console.log('event received' + JSON.stringify(event));
    if (event.data) {
      this.eventSpiltData = event.data.split('|');
      // alert(event.data);
    } else {
      this.eventSpiltData = event.detail.data.split('|');
    }
    this.handleEvent(this.eventSpiltData);
  }

  handleEvent(eventData) {
    if (eventData[0] === 'Disconnect') {

    } else if (eventData[0] === 'CustDisconnect') {
      this.getAgentStatus();
      this.showRemarks(eventData);
      // this.showRemarks(eventData);
    } else if (eventData[0] === 'CallDisconnect') {
      this.getAgentStatus();
      this.disconnectCall();
    } else if (eventData.length > 3 && eventData[3] === 'OUTBOUND') {
    }
  }
  closeCall(eventData, remarks) {
    let requestObj = {};
    requestObj['benCallID'] = this.getCommonData.callData.benCallID;
    requestObj['callTypeID'] = this.validCallID.toString();
    requestObj['fitToBlock'] = 'false';
    requestObj['isFollowupRequired'] = false;
    requestObj['prefferedDateTime'] = undefined
    requestObj['callType'] = 'valid';
    requestObj['beneficiaryRegID'] = this.beneficiaryRegID
    requestObj['remarks'] = remarks;
    requestObj['providerServiceMapID'] = this.getCommonData.current_service.serviceID;
    requestObj['createdBy'] = this.getCommonData.uname;
    requestObj['endCall'] = false;

    this._callServices.closeCall(requestObj).subscribe((response) => {
      if (response) {
        this.remarksMessage.alert('Successfully Call Transfered');
        // if (this.getCommonData.current_campaign.toUpperCase() === 'OUTBOUND') {
        //   this.current_campaign = 'OUTBOUND';
        //   this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard']);
        //   this.basicrouter.navigate(['/InnerpageComponent']);
        // } else {
        this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard']);
        // }
      }
    }, (err) => {
      this.remarksMessage.alert(err.status);
      // this.message.alert(err.status);
    });
  }
  showRemarks(eventData) {
    let remarksGiven;
    remarksGiven = '';
    this.remarksMessage.remarks('Please Enter Remarks').subscribe((response) => {
      if (response) {
        remarksGiven = response;
      } else {
        remarksGiven = 'call tranfered';
      }
      this.closeCall(eventData, remarksGiven);
    }, (err) => { });
    // this.startCallWraupup(eventData);

  }
  startCallWraupup (eventData) {
    const timer = Observable.timer(2000, 1000);
    timer.subscribe(t => {
      this.ticks = (this.timeRemaining - t);
      this.ticks = this.ticks + 's';
      const remarks = 'call tranfered';
      if (t == this.timeRemaining) {
        this.remarksMessage.close();
        this.closeCall(eventData, remarks);
      }
    });
  }
  disconnectCall() {
    this.remarksMessage.alert('Call Disconnected!!!');
    jQuery('#myCarousel').carousel(3);
    jQuery('#four').parent().find('a').removeClass('active-tab');
    jQuery('#four').find('a').addClass('active-tab');
    jQuery('#btnClosure').attr('disabled', 'disabled');
    jQuery('#next').hide();
    jQuery('#previous').show();

  }
  getAgentStatus() {
    this.Czentrix.getAgentStatus().subscribe((res) => {
      this.callStatus = res.data.stateObj.stateName;
      // if (this.callStatus.toLowerCase().trim() === 'closure') {
      //   this.wrapupTime = true;
      //   this.callTime = false;
      // }
      if (res.data.stateObj.stateType) {
        this.callStatus += ' (' + res.data.stateObj.stateType + ')';
      }
    }, (err) => {

    })
  }
  getAgentCallDetails() {
    this.Czentrix.getCallDetails().subscribe((res) => {
      this.TotalCalls = 'Total Calls : ' + res.data.total_calls;
      this.TotalTime = 'Total Calls Durations : ' + res.data.total_call_duration;
      // if (this.callStatus.toLowerCase().trim() === 'closure') {
      //   this.wrapupTime = true;
      //   this.callTime = false;
      // }
      // if (res.data.stateObj.stateType) {
      //   this.callStatus += ' (' + res.data.stateObj.stateType + ')';
      // }
    }, (err) => {

    })
  }
  ngOnDestroy() {
    this.listenCallEvent();
    //this.removeEventListener();
  }
}
