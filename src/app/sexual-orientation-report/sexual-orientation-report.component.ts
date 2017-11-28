import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { LocationService } from '../services/common/location.service';

@Component({
  selector: 'app-sexual-orientation-report',
  templateUrl: './sexual-orientation-report.component.html',
  styleUrls: ['./sexual-orientation-report.component.css']
})
export class SexualOrientationReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  data = [];
  sexualOrientations = [];
  providerServiceMapID: any;
  @ViewChild('sexualOrientationSearchForm') sexualOrientationSearchForm: NgForm;
  postData: any = [];
  orientations = [];
  states = [];
  districts = [];

  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData, private reportsService: ReportsService, private alertService: ConfirmationDialogsService, private locationService: LocationService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.sexualOrientations = response['sexualOrientations'];
      this.states = response['states'];
    },
    (error)=>{
      console.log(error);
    })
    this.today = new Date();
    console.log(this.today);
    this.end_date = this.today;
    this.end_date.setDate(this.today.getDate()-1);
    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate()-7);
    this.minStartDate = new Date();
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
  }

  blockKey(e: any){
      if(e.keyCode===9){
          return true;
      }
      else {
          return false;
      }
  }

  getDistricts(){
    this.districts = [];
    this.sexualOrientationSearchForm.form.patchValue({
      'district': ''
    });
    this.locationService.getDistricts(this.sexualOrientationSearchForm.value.state.stateID)
    .subscribe((response)=>{
      this.districts = response;
    },
    (error)=>{
      console.log(error);
    })
  }

  endDateChange(){
    console.log(this.end_date);
    this.minStartDate = new Date(this.end_date);
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
    this.start_date = new Date(this.end_date);
    this.start_date.setMonth(this.start_date.getMonth()-1);
  }

  getReports(){
    console.log("values:", this.sexualOrientationSearchForm.value);
    this.postData = [];
    if(this.sexualOrientationSearchForm.value.sexuality!=''){
      for(var i=0; i< this.sexualOrientationSearchForm.value.sexuality.length;i++){
        var obj = {
          "startTimestamp": new Date((this.sexualOrientationSearchForm.value.startDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.sexualOrientationSearchForm.value.endDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiarySexualOrientation": this.sexualOrientationSearchForm.value.sexuality[i]
        }
        if(this.sexualOrientationSearchForm.value.state!=''){
          obj['beneficiaryState'] = this.sexualOrientationSearchForm.value.state.stateName;
        }
        if(this.sexualOrientationSearchForm.value.district!=''){
          obj['beneficiaryDistrict'] = this.sexualOrientationSearchForm.value.district;
        }
        this.postData.push(obj);
      }
    }
    else {
      for(var i=0;i<this.sexualOrientations.length;i++){
        var obj = {
          "startTimestamp": new Date((this.sexualOrientationSearchForm.value.startDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.sexualOrientationSearchForm.value.endDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiarySexualOrientation": this.sexualOrientations[i].sexualOrientation
        }
        if(this.sexualOrientationSearchForm.value.state!=''){
          obj['beneficiaryState'] = this.sexualOrientationSearchForm.value.state.stateName;
        }
        if(this.sexualOrientationSearchForm.value.district!=''){
          obj['beneficiaryDistrict'] = this.sexualOrientationSearchForm.value.district;
        }
        this.postData.push(obj);
      }
    }
    console.log(this.postData);
    this.reportsService.getAllBySexualOrientation(this.postData)
    .subscribe((response)=>{
      console.log(response);
      this.tableFlag = true;
      this.orientations = response;
    },
    (error)=>{
      console.log(error);
    })
  }

}
