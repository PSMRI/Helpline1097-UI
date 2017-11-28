import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { LocationService } from '../services/common/location.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-language-distribution-report',
  templateUrl: './language-distribution-report.component.html',
  styleUrls: ['./language-distribution-report.component.css']
})
export class LanguageDistributionReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  data = [];
  languages = [];
  providerServiceMapID: any;
  languageDistributions = [];
  postData = [];
  states = [];
  districts = [];
  @ViewChild('languageDistributionSearchForm') languageDistributionSearchForm: NgForm;

  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData, private locationService: LocationService, private alertService: ConfirmationDialogsService, private reportsService: ReportsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.languages = response['m_language'];
      this.states = response['states']
    })
    this.today = new Date();
    this.today.setDate(this.today.getDate()-1);
    console.log(this.today);
    this.end_date = new Date(this.today);
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
    this.languageDistributionSearchForm.form.patchValue({
      'district': ''
    });
    this.locationService.getDistricts(this.languageDistributionSearchForm.value.state.stateID)
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
    console.log("values:", this.languageDistributionSearchForm.value);
    this.postData = [];
    if(this.languageDistributionSearchForm.value.language!=''){
      for(var i=0; i< this.languageDistributionSearchForm.value.language.length;i++){
        var obj = {
          "startTimestamp": new Date((this.languageDistributionSearchForm.value.startDate.getTime() - 1 * (this.languageDistributionSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.languageDistributionSearchForm.value.endDate.getTime() - 1 * (this.languageDistributionSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiaryPreferredLanguage": this.languageDistributionSearchForm.value.language[i]
        }
        if(this.languageDistributionSearchForm.value.state!=''){
          obj['beneficiaryState'] = this.languageDistributionSearchForm.value.state.stateName;
        }
        if(this.languageDistributionSearchForm.value.district!=''){
          obj['beneficiaryDistrict'] = this.languageDistributionSearchForm.value.district;
        }
        this.postData.push(obj);
      }
    }
    else {
      for(var i=0;i<this.languages.length;i++){
        var obj = {
          "startTimestamp": new Date((this.languageDistributionSearchForm.value.startDate.getTime() - 1 * (this.languageDistributionSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.languageDistributionSearchForm.value.endDate.getTime() - 1 * (this.languageDistributionSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiaryPreferredLanguage": this.languages[i].languageName
        }
        if(this.languageDistributionSearchForm.value.state!=''){
          obj['beneficiaryState'] = this.languageDistributionSearchForm.value.state.stateName;
        }
        if(this.languageDistributionSearchForm.value.district!=''){
          obj['beneficiaryDistrict'] = this.languageDistributionSearchForm.value.district;
        }
        this.postData.push(obj);
      }
    }
    console.log(this.postData);
    this.reportsService.getCountsByPreferredLanguage(this.postData)
    .subscribe((response)=>{
      console.log(response);
      this.tableFlag = true;
      this.languageDistributions = response;
    },
    (error)=>{
      console.log(error);
    })
  }
  download() {
      var options = { 
   
    showLabels: true, 
    showTitle: true

  };
  
   let head = Object.keys(this.languageDistributions[0]);
   // console.log(head);
        new Angular2Csv(this.languageDistributions, 'LanguageDistributions Report',{headers: (head)});
  }
}
