import { Component, OnInit } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { dataService } from '../services/dataService/data.service';
import { LocationService } from '../services/common/location.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-caller-age-report',
  templateUrl: './caller-age-report.component.html',
  styleUrls: ['./caller-age-report.component.css']
})
export class CallerAgeReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  data = {};
  states = [];
  state: any;
  districts = [];
  district: any;
  ageGroup: any;
  ageGroups = [];
  providerServiceMapID: any;
  constructor(private _userBeneficiaryData: UserBeneficiaryData, private saved_data: dataService,
    private _locationService: LocationService, private reportService: ReportsService) { }

  ngOnInit() {
    this.today = new Date();
    console.log(this.today);
    this.end_date = new Date();
    this.end_date.setDate(this.today.getDate() - 1);
    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate() - 7);
    this.minStartDate = new Date();
    this.minStartDate.setMonth(this.minStartDate.getMonth() - 1);
    //call api and initialize data
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe((response) => {
        this.SetUserBeneficiaryRegistrationData(response)
      },
      (err) => {

      });
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.ageGroups = [
      {
        "ageGroupDisplay": "Below 15",
        "ageGroupValue": {
          "minAge": 0,
          "maxAge": 15
        }
      },
      {
        "ageGroupDisplay": "15 to 24",
        "ageGroupValue": {
          "minAge": 15,
          "maxAge": 24
        }
      },
      {
        "ageGroupDisplay": "24 to 39",
        "ageGroupValue": {
          "minAge": 24,
          "maxAge": 39
        }
      },
      {
        "ageGroupDisplay": "40 to 59",
        "ageGroupValue": {
          "minAge": 40,
          "maxAge": 59
        }
      },
      {
        "ageGroupDisplay": "Above 59",
        "ageGroupValue": {
          "minAge": 59,
          "maxAge": 120
        }
      }
    ]
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  endDateChange() {
    console.log(this.end_date);
    this.minStartDate = new Date(this.end_date);
    this.minStartDate.setMonth(this.minStartDate.getMonth() - 1);
    this.start_date = new Date(this.end_date);
    this.start_date.setMonth(this.start_date.getMonth() - 1);
  }

  getReports(value) {

    let noOfGroups = value.ageGroup.length;
    let array = [];
    let obj = {};

    let start_date = new Date((value.startDate) - 1 * (value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    let end_date = new Date((value.startDate) - 1 * (value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    let state = undefined;
    if (this.state) {
      state = this.state.stateName;
    }
    // else {
    //   state = "";
    // }
    let district = undefined
    if (this.district) {
      district = this.district;
    }
    for (let i = 0; i < noOfGroups; i++) {
      obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "maxAge": value.ageGroup[i].maxAge,
        "minAge": value.ageGroup[i].minAge,
        "startTimestamp": start_date,
        "endTimestamp": end_date,
        "beneficiaryState": state,
        //"beneficiaryDistrict": value.district ? value.district : ""
        "beneficiaryDistrict": district
      }
      array.push(obj);
    }
    console.log(array);
    this.reportService.getAllByAgeGroup(array).subscribe((response) => { this.reportSuccessHandle(response) }, (err) => { });
  }
  count = [];
  reportSuccessHandle(res) {
    console.log(res);
    this.tableFlag = true;
    this.count = res;
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
  download() {
    var options = {

      showLabels: true,
      showTitle: true

    };

    let head = Object.keys(this.count[0]);
    console.log(head);
    new Angular2Csv(this.count, 'AgeGroup Report', { headers: (head) });
  }
}
