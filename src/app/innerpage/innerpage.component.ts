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
import { ClosureComponent } from '../closure/closure.component';
import { Observable } from 'rxjs/Rx';
import { ListnerService } from './../services/common/listner.service';
import { AuthService } from '../services/authentication/auth.service';
import { RegisterService } from '../services/register-services/register-service';
import { Subscription } from 'rxjs/Subscription';

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
  wrapUpTimeInSeconds = 120;
  // language change stuff
  languageFilePath: any = 'assets/language.js';
  selectedlanguage: any = '';
  currentlanguageSet: any = {};
  language_change: any;
  beneficiaryRegID: any;
  providerServiceMapId: any;
  timeRemaining: number = 20;
  ticks: any;
  callStatus: any;
  callTime: boolean = true;
  wrapupTime: boolean = false;
  TotalCalls: any;
  TotalTime: any;
  id: any;
  disconectCallId: any;
  wrapupCallID: any;
  backToDashboard: boolean = true;
  callID: any;
  wrapupTimerSubscription: Subscription;
  ipAddress: any;
  // eventSpiltData: any;


  @Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
  @Output() StartNewCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  current_service: any;
  current_role: any;
  // loginUrl = this._config.getCommonLoginUrl();
  data: any = {};
  ctiHandlerURL: any;
  transferCallID: any;
  listenCallEvent: any;
  transferInProgress: Boolean = false;
  zoneName: any;
  everwellFullname: string;
  EverwellBeneficiaryRegID: string;
  everwellPrimaryNumber: string;
  isEverwell:string = "No";
  everwellSelectedBenData:any;
  everwellState: any;
  everwellDistrict: any;
  everwellGender: any;
  eapiID: any;
  everwelleapiId: any;
  everwellSubmitBtn: boolean = false;
  custdisconnectCallID: any;
  constructor(
    public getCommonData: dataService,
    private _callServices: CallServices,
    public basicrouter: Router,
    public router: ActivatedRoute,
    public HttpServices: HttpServices,
    public http: Http, private _util: RegisterService,
    public sanitizer: DomSanitizer,
    private _config: ConfigService,
    private remarksMessage: ConfirmationDialogsService,
    private renderer: Renderer,
    private Czentrix: CzentrixServices,
    private listnerService: ListnerService,
    private authService: AuthService,
    private _common: dataService
    // private closureComponent: ClosureComponent

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
    
    this.current_service = this.getCommonData.current_service.serviceName;
    this.current_role = this.getCommonData.current_role.RoleName;
    const obj = { 'innerPage': true };
    this.listnerService.cZentrixSendData(obj);
    this.data = this.getCommonData.Userdata;
    this.id = this.getCommonData.cZentrixAgentID;

    this.providerServiceMapId = this.getCommonData.current_service.serviceID;

    const url = this._config.getTelephonyServerURL() + 'bar/cti_handler.php?e=' + this.id;
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    if (sessionStorage.getItem("CLI") !== undefined) {​​​​​​​​
    this.callerNumber = sessionStorage.getItem("CLI");
        }​​​​​​​​
    if (sessionStorage.getItem("callCategory") !== undefined) {​​​​​​​
        if (sessionStorage.getItem("callCategory") === 'OUTBOUND') {
          this.getCommonData.isOutbound = true;
        } else {
          this.getCommonData.isOutbound = false;
        }
      }
      // if (params['callID'] != undefined) {
      //   let callID = params['callID'];
      //   if (this.current_role.toLowerCase() != 'supervisor') {
      //     this.benByCallID(callID);
      //   }
      // }
    this.getCallTypes(this.providerServiceMapId);
    this.language_change = 'english';
    this.getLanguageObject(this.language_change);
    this.getIVRSPathDetails();

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
    this.isEverwell = sessionStorage.getItem("isEverwellCall");


  }
  addActiveClass(val: any) {
    jQuery('#' + val).parent().find('a').removeClass('active-tab');
    jQuery('#' + val).find('a').addClass('active-tab');
  }

  benByCallID(callID) {
    let data = '{"callID":"' + callID + ', "is1097":true}';
    this._callServices.getBeneficiaryByCallID(data).subscribe(response => {
      if (response.i_beneficiary) {
        this._util.retrieveRegHistory(response.i_beneficiary.beneficiaryID).subscribe(response => {
          this.getSelectedBenDetails(response[0]);
        }),
          (err) => {
            console.log("Error in getting ben history");
          }
      } // this will be excuted in case of browser off only
      else {
        //    this.retrieveData();
      }
    }, (err) => {
      //  this.retrieveData();
      console.log("error in benDetailByCallerID");
    });
  }
  retrieveData() {
    if (this.getCommonData.current_campaign == 'OUTBOUND') {
      this._util.retrieveRegHistory(this.getCommonData.outboundBenRegID).subscribe(response => {
        this.getSelectedBenDetails(response[0]);
      }),
        (err) => {
          console.log("Error in getting ben history");
        }
    }			// this code is to load navbar data in case of OUTBOUND
  }
  calculateAge(date) {
    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - newDate.getFullYear();
      const month = today.getMonth() - newDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < newDate.getDate())) {
        age--;
      }
      return age;
    } else {
      return undefined;
    }
  }
  getSelectedBenDetails(obj: any) {
    let data: any = {};
    if (obj != null && obj.beneficiaryID != undefined) {
      this._util.retrieveRegHistory(obj.beneficiaryID)
        .subscribe(response => {
          if (response.length > 0) {
            data = response[0];
            if (data != null) {
              this.getCommonData.beneficiarySelected.next({
                "beneficiarySelected": true
              });
              console.log('**********BENEFICIARY REG ID**********', data.beneficiaryRegID);
              this.getCommonData.beneficiaryRegID = data.beneficiaryRegID;
              this.selectedBenData.id = 'Ben ID: ' + data.beneficiaryID;
              this.beneficiaryRegID = data.beneficiaryRegID;
              let fname = data.firstName ? data.firstName : "";
              let lname = data.lastName ? data.lastName : "";
              this.selectedBenData.name =  fname + ' ' + lname;
              // if ( data.dOB )
              // {
              //  let currDate = new Date();
              //  let dob = new Date( data.dOB );
              //  let age = new Date( currDate.getTime() - dob.getTime() ).getFullYear() - this.startYear;

              // this.selectedBenData.age = 'Age: ' + this.calculateAge(data.dOB);
              // this.selectedBenData.age = 'Age: ' + (data.age ? data.age : "");
              this.selectedBenData.age =  (data.actualAge ? data.actualAge : "") + " " + (data.ageUnits ? data.ageUnits : "");
              // }
              this.selectedBenData.gender =  (data.m_gender ? (data.m_gender.genderName ? data.m_gender.genderName : "") : "");
              this.selectedBenData.state =   (data.i_bendemographics ? (data.i_bendemographics.m_state ? (data.i_bendemographics.m_state.stateName ? data.i_bendemographics.m_state.stateName : "") : "") : "");
              this.selectedBenData.district =  (data.i_bendemographics ? (data.i_bendemographics.m_district ? (data.i_bendemographics.m_district.districtName ? data.i_bendemographics.m_district.districtName : "") : '') : '');
              this.selectedBenData.block =  (data.i_bendemographics ? (data.i_bendemographics.m_districtblock ? (data.i_bendemographics.m_districtblock.blockName ? data.i_bendemographics.m_districtblock.blockName : '') : '') : '');
              this.selectedBenData.village =  (data.i_bendemographics ? (data.i_bendemographics.m_districtbranchmapping ? (data.i_bendemographics.m_districtbranchmapping.villageName ? data.i_bendemographics.m_districtbranchmapping.villageName : '') : '') : '');
              this.selectedBenData.language =  (data.i_bendemographics ? (data.i_bendemographics.m_language ? (data.i_bendemographics.m_language.languageName ? data.i_bendemographics.m_language.languageName : '') : '') : '');
              this.selectedBenData.relation =  (data.benPhoneMaps[0] ? (data.benPhoneMaps[0].benRelationshipType ? (data.benPhoneMaps[0].benRelationshipType.benRelationshipType) : '') : '');
            } else {
              this.getCommonData.beneficiarySelected.next({
                "beneficiarySelected": false
              });
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
        }, err => {
          console.log(err, 'error');
        })
    } else {
      this.getCommonData.beneficiarySelected.next({
        "beneficiarySelected": false
      });
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


  
  getEverwellSelectedBenDetails(obj: any) {   
   console.log('evewellcall311' , obj);
   console.log(obj);
   this.getCommonData.everwellBeneficiarySelected.next({
    "isEverwellBeneficiarySelected": true
  });
    this.everwellSelectedBenData = obj;
    let firstName = obj.FirstName ? obj.FirstName : "";
    let lname = obj.LastName ? obj.LastName : "";
    this.EverwellBeneficiaryRegID = 'Ben ID: ' + obj.beneficiaryID;
    console.log("innerpage", obj);
    this.everwellFullname = firstName + ' ' + lname;
    this.everwellPrimaryNumber = obj.PrimaryNumber;
    this.everwellState = obj.state;
    this.everwellDistrict = obj.district;
    this.everwellGender = obj.Gender;

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
    this.HttpServices.getLanguage(this.languageFilePath).subscribe(response => this.successhandeler(response, language),
      (err) => {
        this.remarksMessage.alert(err.errorMessage);

        console.log("error in fetching language");
      });

  }

  successhandeler(response, language) {
    console.log('language triggered and recieved', response, language);
    this.currentlanguageSet = response[language];
  }
  // logOut() {
  //   // Cookie.deleteAll();
  //   this.basicrouter.navigate(['']);
  //   // location.assign(this.loginUrl);
  // }
  log_out() {
    if (this.getCommonData.current_role.RoleName.toUpperCase() != 'SUPERVISOR') {
      this.remarksMessage.alert('Cannot logout during active call');
    } else {
      sessionStorage.removeItem('isOnCall');
      sessionStorage.removeItem('isEverwellCall');
      this.basicrouter.navigate(['']);
      this.authService.removeToken();
    }

  }

  logOut() {
    if (this.getCommonData.loginIP === undefined || this.getCommonData.loginIP === '') {
      this.Czentrix.getIpAddress(this.getCommonData.cZentrixAgentID).subscribe((res) => {
        if (res) {
          this.ipAddress = res.response.agent_ip;
          this.ipSuccessLogoutHandler(res.response.agent_ip);
        }
      },
        (err) => {
          console.log(err.errorMessage, "LOGOUT ERROR");
          this.remarksMessage.alert(err.errorMessage);

        });
    } else {
      this.ipSuccessLogoutHandler(this.getCommonData.loginIP);
    }

  }
  ipSuccessLogoutHandler(response) {
    this.Czentrix.agentLogout(this.getCommonData.cZentrixAgentID, response).subscribe((res) => {
      if (res.response.status.toUpperCase() !== 'FAIL') {
        sessionStorage.removeItem('isOnCall');
        sessionStorage.removeItem('isEverwellCall');
        sessionStorage.removeItem('apiman_key');
        this.basicrouter.navigate(['']);
      } else {
        if (this.current_role.toLowerCase() !== 'supervisor') {

          this.remarksMessage.alert('Cannot logout during active call');
        } else {
          sessionStorage.removeItem('isOnCall');
          sessionStorage.removeItem('isEverwellCall');
          sessionStorage.removeItem('apiman_key');          
          this.basicrouter.navigate(['']);
        }
      }
    }, (err) => {
      console.log(err.errorMessage, "LOGOUT ERROR");
      this.remarksMessage.alert(err.errorMessage);

    });


    if (this.current_role.toLowerCase() !== 'supervisor') {
      this.Czentrix.agentLogout(this.getCommonData.cZentrixAgentID, response).subscribe((res) => {
        if (res.response.status.toUpperCase() !== 'FAIL') {
          sessionStorage.removeItem('isOnCall');
          sessionStorage.removeItem('isEverwellCall');
          this.basicrouter.navigate(['']);
        } else {
          // if (this.current_role.toLowerCase() !== 'supervisor') {
          this.remarksMessage.alert('Cannot logout during active call');
          // }
        }
      }, (err) => {
        this.remarksMessage.alert(err.errorMessage);
      });
    } else {
      sessionStorage.removeItem('isOnCall');
      sessionStorage.removeItem('isEverwellCall');
      this.basicrouter.navigate(['']);
    }
  }
  getCallTypes(providerServiceMapID) {
    const requestObject = { 'providerServiceMapID': providerServiceMapID };
    if (this.getCommonData.current_campaign == 'INBOUND') {
      requestObject['isInbound'] = true;
    } else {
      requestObject['isOutbound'] = true;
    }
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      console.log(response);
      let transferObj = response.filter(function (item) {
        console.log(item.callGroupType);
        return item.callGroupType.toLowerCase().startsWith('transfer');
      });
      if (transferObj && transferObj[0].callTypes) {
        transferObj = transferObj[0].callTypes.filter(function (previousData) {
          console.log("transfer call types " + previousData.callTypeDesc);
          return previousData.callTypeDesc.toLowerCase().startsWith('transfer')
        });
        if (transferObj && transferObj[0].callTypeID) {
          this.transferCallID = transferObj[0].callTypeID;
        }
      } else {
        this.remarksMessage.alert('Failed to get call types');
      }

      // let wrapupObj = response.filter(function (item) {
      //   return item.callGroupType.toLowerCase().startsWith('wrapup');
      // });
      // if (wrapupObj.length > 0) {
      //   if (wrapupObj[0].callTypes) {
      //     wrapupObj = wrapupObj[0].callTypes.filter(function (item) {
      //       console.log("wrapup call types " + item.callTypeDesc);
      //       return item.callTypeDesc.toLowerCase().startsWith('wrapup');
      //     });
      //   }
      //   if (wrapupObj.length > 0) {
      //     if (wrapupObj[0].callTypeID != undefined) {
      //       this.wrapupCallID = wrapupObj[0].callTypeID;
      //     }
      //   }
      // }

      for (let i = 0; i < response.length; i++) {
        if (response[i].callGroupType.startsWith('Wrapup')) {
          if (response[i].callTypes) {
            for (let j = 0; j < response[i].callTypes.length; j++) {
              if (response[i].callTypes[j].callType.startsWith('Wrapup')) {
                this.wrapupCallID = response[i].callTypes[j].callTypeID;
                break;
              }
            }
          }
        }
      }



      let validObj = response.filter(function (item) {
        console.log(item.callGroupType);
        return item.callGroupType.toLowerCase().startsWith('valid')
      });
      if (validObj && validObj[0].callTypes) {
        validObj = validObj[0].callTypes.filter(function (previousData) {
          console.log("Valid call types " + previousData.callTypeDesc);
          return previousData.callTypeDesc.toLowerCase().startsWith('valid')
        });
        if (validObj && validObj[0].callTypeID) {
          this.disconectCallId = validObj[0].callTypeID;
        }
      } else {
        this.remarksMessage.alert('Failed to get call types');
      }
      if (!this.transferCallID) {
        this.transferCallID = this.disconectCallId;
      }
      console.log('valid call id', this.transferCallID);
    }, (err) => {
      this.remarksMessage.alert(err.errorMessage);

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
    console.log('received event ' + eventData);
    const sessionVar = /^\d{10}\.\d{10}$/;
    if (eventData[0].trim().toLowerCase() === "accept") {
      this.ticks = 0;
      this.unsubscribeWrapupTime();
    } else {
      // this.ticks = 0;
      // this.unsubscribeWrapupTime();
    }
    if (eventData[0] === 'Disconnect') {

    } else if (eventData[0] === 'AgentXfer' || eventData[0] === 'CampaignXfer') {
      // this.getAgentStatus();
      // this.showRemarksNew(eventData);
      // this.transferInProgress = true;
    } else if (eventData[0] === 'CustDisconnect' && !this.transferInProgress
      && (sessionVar.test(eventData[1]) || eventData[1] === '')) {
        this.custdisconnectCallID = eventData[1];
      this.getAgentStatus();
      console.log("this.isEverwell ",this.isEverwell );
      
      if(this.isEverwell != "yes"){
        this.disconnectCall();
      }      
      this.startCallWraupup(eventData);
      this._common.everwellCallNotConnected="yes";
    } else if (eventData.length > 3 && eventData[3] === 'OUTBOUND') {
      this.getCommonData.isOutbound = true;
    }
  }
  unsubscribeWrapupTime() {
    if (this.wrapupTimerSubscription) {
      this.wrapupTimerSubscription.unsubscribe();
    }
  }
  closeCall(eventData, remarks, message?: any, wrapupCallID?: any) {    
    
    console.log("wrapup",this.wrapupCallID);
    console.log("transferCallID",this.transferCallID);
    console.log("submitting the everwellrsponse", this.everwellSubmitBtn );
    console.log("submitting the everwellrsponse", this.isEverwell  );
    if(this.isEverwell != undefined && this.isEverwell === "yes" && this.everwellSubmitBtn ){
      console.log("submitting the everwellrsponse", this.everwellSubmitBtn );
      console.log("submitting the everwellrsponse", this.isEverwell  );
      
      let outboundObj = {};
      outboundObj['eapiId'] = this._common.outboundEverwellData.eapiId;
      outboundObj['assignedUserID'] = this._common.uid;
      outboundObj['isCompleted'] = true;
      outboundObj['beneficiaryRegId'] = this._common.outboundEverwellData.beneficiaryRegId;
      outboundObj['callTypeID'] = (this.wrapupCallID === null || this.wrapupCallID === undefined) ? null: this.wrapupCallID.toString();
      outboundObj['benCallID'] = this.getCommonData.callData.benCallID;
      outboundObj['callId'] = this._common.callID;
      outboundObj['providerServiceMapId'] = this.getCommonData.current_service.serviceID;
      outboundObj['requestedServiceID'] = null;
      outboundObj['preferredLanguageName'] = "All"
      outboundObj['createdBy'] = this._common.uname;

      this._callServices.closeEverwellOutBoundCall(outboundObj).subscribe((response) => {
       console.log("everwell data updated");
       
      }, (err) => {
        this.remarksMessage.alert(err.status, 'error');
      })

      console.log("everwell obj" , outboundObj);
    }
    
      

    let requestObj = {};
    requestObj['benCallID'] = this.getCommonData.callData.benCallID;
    if (!this.transferInProgress) {
      requestObj['callTypeID'] = (this.wrapupCallID === null || this.wrapupCallID === undefined) ? null : this.wrapupCallID.toString();
      requestObj['fitToBlock'] = 'false';
      requestObj['isFollowupRequired'] = false;
      requestObj['prefferedDateTime'] = undefined;
      requestObj['endCall'] = true;
    } else {
      requestObj['callTypeID'] = (this.transferCallID === null || this.transferCallID === undefined) ? null : this.transferCallID.toString();
      requestObj['fitToBlock'] = 'false';
      requestObj['isFollowupRequired'] = false;
      requestObj['prefferedDateTime'] = undefined;
      requestObj['endCall'] = false;
    }
    if (this.getCommonData.current_campaign == 'OUTBOUND') {
      requestObj['isCompleted'] = true;
    }
    requestObj['callType'] = 'wrapup exceeds';
    requestObj['beneficiaryRegID'] = this.beneficiaryRegID
    requestObj['remarks'] = remarks;
    requestObj['providerServiceMapID'] = this.getCommonData.current_service.serviceID;
    requestObj['createdBy'] = this.getCommonData.uname;
    requestObj['agentID'] = this.getCommonData.cZentrixAgentID;
    requestObj['agentIPAddress'] = this.ipAddress;

    if (wrapupCallID != undefined) {
      requestObj['callTypeID'] = wrapupCallID;
      requestObj['agentID'] = this.getCommonData.cZentrixAgentID;
      requestObj['endCall'] = true;
    }
    if (sessionStorage.getItem("session_id") === this.custdisconnectCallID) {
    this._callServices.closeCall(requestObj).subscribe((response) => {
      if (response) {
        this.remarksMessage.alert(message, 'success');
        sessionStorage.removeItem('isOnCall');
        sessionStorage.removeItem('isEverwellCall');
        this.basicrouter.navigate(['/MultiRoleScreenComponent/dashboard']);
        this._common.everwellCallNotConnected = null;
        // this._callServices.disconnectCall(this.getCommonData.cZentrixAgentID).subscribe((res) => {
        //   console.log('disconnect response', res);

        // }, (err) => {
        //   this.remarksMessage.alert(err.errorMessage);

        // });
      }
    }, (err) => {
      this.remarksMessage.alert(err.status, 'error');
    });
  }else {
    console.log(
      "previous custdisconnect call ID not verified with current call ID",
      this.custdisconnectCallID
    );
  }
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
    }, (err) => {
      this.remarksMessage.alert(err.errorMessage);
    });
    // this.startCallWraupup(eventData);

  }


  showRemarksNew(eventData) {
    let remarksGiven;
    remarksGiven = eventData[0] + ' to ' + eventData[2];
    this.closeCall(eventData, remarksGiven, 'Call Transfered Successfully');
  }

  startCallWraupup(eventData) {
    this.wrapupTime = true;
    this.callTime = false;
    const timer = Observable.timer(2000, 1000);
    this.wrapupTimerSubscription = timer.subscribe(t => {
      this.ticks = (this.timeRemaining - t);
      this.ticks = this.ticks + 's';
      const remarks = 'Call disconnect from customer.';
      
      if (t == this.timeRemaining) {
        this.wrapupTimerSubscription.unsubscribe();
        t = 0;
        this.ticks = 0;
        // this.remarksMessage.close();
        this.closeCall(eventData, remarks, 'Call closed successfully', this.wrapupCallID);
      }
    });
  }
  disconnectCall() {
    // this.remarksMessage.alert('Call Disconnected From Caller. Please Proceed To Call Closure.');
    this.getCommonData.isCallDisconnected = true;
    jQuery('#myCarousel').carousel(3);
    jQuery('#four').parent().find('a').removeClass('active-tab');
    jQuery('#four').find('a').addClass('active-tab');
    jQuery('#btnClosure').attr('disabled', 'disabled');
    jQuery('#btnCancel').attr('disabled', 'disabled');
    jQuery('#next').hide();
    jQuery('#previous').show();
  }
  getAgentStatus() {
    this.Czentrix.getAgentStatus().subscribe((res) => {
      this.callStatus = res.data.stateObj.stateName;
      if (this.callStatus.toLowerCase().trim() === 'closure') {
        this.wrapupTime = true;
        this.callTime = false;
      }
      if (res.data.stateObj.stateType) {
        this.callStatus += ' (' + res.data.stateObj.stateType + ')';
      }
    }, (err) => {
      // this.remarksMessage.alert(err.errorMessage);
      console.log("CZ AGENT NOT LOGGED IN");
    })
  }

  getIVRSPathDetails() {
    this.zoneName = undefined;
    this.Czentrix.getIVRSPathDetails().subscribe((res) => {
      this.zoneName = res.data.zoneName;
    }, (err) => {
      // this.remarksMessage.alert(err.errorMessage);
      console.log("CZ AGENT NOT LOGGED IN");
    })
  }

  getAgentCallDetails() {
    this.Czentrix.getCallDetails().subscribe((res) => {
      console.log('CALL DETAILS RESPONSE', res);
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
      if (this.getCommonData.current_role.RoleName.toUpperCase() != 'SUPERVISOR') {
        this.remarksMessage.alert(err.errorMessage);
      }

    })
  }
  ngOnDestroy() {
    this.listenCallEvent();

    if (this.wrapupTimerSubscription)
      this.wrapupTimerSubscription.unsubscribe();

  }
  finalSubmitBtnCheck(submitBtnStatus){
    this.everwellSubmitBtn = submitBtnStatus;
  }
}
