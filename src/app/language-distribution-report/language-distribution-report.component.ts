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
  maxStartDate: Date;
  maxEndDate: Date;

  @ViewChild('languageDistributionSearchForm') languageDistributionSearchForm: NgForm;

  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData,
   private locationService: LocationService, private alertService: ConfirmationDialogsService,
    private reportsService: ReportsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.languages = response['m_language'];
            let all = {
        "languageName": "All"
      }
      this.languages.push(all);
      this.states = response['states']
    }),(err) =>       this.alertService.alert(err.errorMessage);

    // this.today = new Date();
    // this.today.setDate(this.today.getDate()-1);
    // console.log(this.today);
    // this.end_date = new Date(this.today);
    // this.start_date = new Date();
    // this.start_date.setDate(this.today.getDate()-7);
    // this.minStartDate = new Date();
    // this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
        this.today = new Date();
    this.end_date = new Date();
    this.end_date.setDate(this.today.getDate() - 1);
    this.end_date.setHours(23,59,59,0);

    this.start_date = new Date();
   this.start_date.setDate(this.today.getDate()-7);
   this.start_date.setHours(0,0,0,0);

    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0,0,0,0);

    this.maxEndDate = new Date();
        this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23,59,59,0);
        this.providerServiceMapID = this.dataService.current_service.serviceID;

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
      this.alertService.alert(error.errorMessage);
      console.log(error);
    })
  }

  endDateChange() {

    //console.log("sd,med", this.start_date, this.maxEndDate);
    if(this.today.getTime() < this.maxEndDate.getTime()) {
      let i = new Date();
      i.setDate(this.today.getDate() - 1);
      this.maxEndDate = i;
      this.maxEndDate.setHours(23,59,59,0);
      //console.log("sd,med", this.start_date, this.maxEndDate);
    }
    else {
      this.maxEndDate = new Date(this.start_date);
      this.maxEndDate.setMonth(this.maxEndDate.getMonth()+1);
      this.maxEndDate.setHours(23,59,59,0);
    }

    var timeDiff = this.end_date.getTime() - this.start_date.getTime() ;
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    if(diffDays > 90) {
      var tempDate = new Date(this.start_date);
      tempDate.setMonth(this.start_date.getMonth()+1);
      tempDate.setHours(23,59,59,0);
      this.languageDistributionSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
    if(diffDays < 0) {
      var tempDate = new Date(this.start_date);
      tempDate.setHours(23,59,59,0);
      this.languageDistributionSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
  }

  getReports(){
    console.log("values:", this.languageDistributionSearchForm.value);
    this.postData = [];
    if(this.languageDistributionSearchForm.value.language == "All"){
      for(var i=0;i<this.languages.length-1;i++){
        var obj = {
        "providerServiceMapID": this.providerServiceMapID,

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
    else {

    //  for(var i=0; i< this.languageDistributionSearchForm.value.language.length;i++){
        var obj = {
          "providerServiceMapID": this.providerServiceMapID,

          "startTimestamp": new Date((this.languageDistributionSearchForm.value.startDate.getTime() - 1 * (this.languageDistributionSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.languageDistributionSearchForm.value.endDate.getTime() - 1 * (this.languageDistributionSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiaryPreferredLanguage": this.languageDistributionSearchForm.value.language
        }
        if(this.languageDistributionSearchForm.value.state!=''){
          obj['beneficiaryState'] = this.languageDistributionSearchForm.value.state.stateName;
        }
        if(this.languageDistributionSearchForm.value.district!=''){
          obj['beneficiaryDistrict'] = this.languageDistributionSearchForm.value.district;
        }
        this.postData.push(obj);
   //   }


    }
    console.log(this.postData);
    this.reportsService.getCountsByPreferredLanguage(this.postData)
    .subscribe((response)=>{
      console.log(response);
      this.tableFlag = true;
      this.languageDistributions = response;
    },
    (error)=>{
      this.alertService.alert(error.errorMessage);
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
            this.alertService.alert('Language distribution report downloaded','success');

  }
}
