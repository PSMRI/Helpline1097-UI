import { Component, OnInit } from '@angular/core';
import { SupervisorCallTypeReportService } from '../services/supervisorServices/supervisor-calltype-reports-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from '../services/common/location.service';

@Component({
  selector: 'app-supervisor-calltype-reports',
  templateUrl: './supervisor-calltype-reports.component.html',
  styleUrls: ['./supervisor-calltype-reports.component.css']
})
export class SupervisorCalltypeReportsComponent implements OnInit {

  // ngmodels
  maxDate: Date;
  today: Date;


  callType: any;
  start_date: any;
  end_date: any;
  callTypeID: any;
  // arrays
  callsubTypeID:any;
  calltypes: any;
  callTypeObj: any;
  data: any;
  callSubTypes: any;
  // flags
  gender: any;
  genders = [];
  providerServiceMapID: any;
  minStartDate: any;
  tableFlag: boolean;
  showPaginationControls: boolean;
  sexuality: any;
  state: any;
  states = [];
  district: any;
  districts = [];
  sexualOrientations = [];
  language: any;
  languages=[];
  callTypeName:any;
  constructor(public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
    public commonDataService: dataService, private alertMessage: ConfirmationDialogsService,
    private _userBeneficiaryData: UserBeneficiaryData,private _locationService: LocationService) {

    this.tableFlag = false;
    this.today = new Date();
    this.data = [];

  }

  ngOnInit() {
    this.maxDate = new Date();
    this.start_date = 

    this.today = new Date();
    console.log(this.today);
    this.end_date = new Date();
    this.end_date.setDate(this.today.getDate()-1);
    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate()-7);
    this.minStartDate = new Date();
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);

    let requestObject = { 'providerServiceMapID': this.commonDataService.current_service.serviceID };
    this._SupervisorCallTypeReportService.getCallTypes(requestObject).subscribe((response: Response) => {
      this.callTypeObj = response;
      this.populateCallTypes(response)
    });

    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this._userBeneficiaryData.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.sexualOrientations = response['sexualOrientations'];
      this.states = response['states'];
      this.genders = response['m_genders'];
      this.languages = response['m_language'];

    },
    (error)=>{
      console.log(error);
    })
    this.showPaginationControls = false;
  }

  setTableFlag(val) {
    this.tableFlag = val;
    this.get_filterCallList();
  }
  audioEvent() {
    this.alertMessage.alert('No Audio File Uploded.');
  }
  get_filterCallList() {

    let start_date = new Date((this.start_date) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z"; 
    let end_date = new Date((this.end_date) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z"; 
    let state;
    if(this.state){
      state = this.state.stateName;
    }
    else {
      state = "";
    }
    let requestObj = {
      "providerServiceMapID": this.commonDataService.current_service.serviceID,
      "beneficiaryCallType": this.callTypeName,
      "beneficiaryCallSubType": this.callsubTypeID,
      "filterStartDate": start_date,
      "filterEndDate": end_date,
      "beneficiaryState": state,
      "beneficiaryDistrict": this.district,
      "gender": this.gender,
      "beneficiaryPreferredLanguage": this.language,
      "beneficiarySexualOrientation": this.sexuality
    }

    // if (this.start_date && this.end_date) {
    //   requestObj.filterStartDate = new Date((this.start_date) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON();
    //   requestObj.filterEndDate = new Date((this.end_date) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON();

    // } else {
    //   requestObj.filterStartDate = undefined;
    //   requestObj.filterEndDate = undefined;
    // }
    console.log(requestObj);
    // write the api here to get filtercall list
    this._SupervisorCallTypeReportService.filterCallList(JSON.stringify(requestObj)).subscribe(
      (response: Response) => this.data = this.successhandeler(response));
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  successhandeler(response) {
    console.log(response, 'respinse call wala');
    if (response.length > 5) {
      this.showPaginationControls = true;
    }
    return response;
  }
  populateCallTypes(response: any) {
    this.calltypes = response.map(function (item) {
      return { 'callTypeDesc': item.callGroupType };
    });
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  getCallSubType(callType: any) {

    this.callSubTypes = this.callTypeObj.filter(function (item) {
      return item.callGroupType === callType;
    }).map(function (previousData, item) {
      return previousData.callTypes;
    })[0];
  }
    SetUserBeneficiaryRegistrationData(response) {
    const regData = response;
    if (regData.states) {
      this.states = regData.states;
    }
  }

  GetDistricts(state: any) {
    this.districts = [];
    this.district = undefined;
    if (state) {
      this._locationService.getDistricts(state.stateID)
      .subscribe((response) => this.SetDistricts(response), (err) => { });
    }
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
}
