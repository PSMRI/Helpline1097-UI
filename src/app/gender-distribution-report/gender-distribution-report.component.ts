import { Component, OnInit, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { LocationService } from '../services/common/location.service';
import { NgForm } from '@angular/forms';

import { Angular2Csv } from 'angular2-csv/Angular2-csv'; 



@Component({
  selector: 'app-gender-distribution-report',
  templateUrl: './gender-distribution-report.component.html',
  styleUrls: ['./gender-distribution-report.component.css']
})
export class GenderDistributionReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  
  genders = [];
  providerServiceMapID: any;
  maxStartDate: Date;
  request_obj:any;
  request_array:any=[];
  maxEndDate: Date;
  states:any=[];
  districts:any=[];
  state:any;
  district:any;
  gender_distribution_resultset:any=[];
   @ViewChild('genderDistributionSearchForm') genderDistributionSearchForm: NgForm;


  constructor(private dataService: dataService,
              private userbeneficiarydata: UserBeneficiaryData,
              private reportsService:ReportsService,
              private alertService:ConfirmationDialogsService,
              private _locationService: LocationService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;

    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.genders = response['m_genders'];
      let all = {
        "genderName": "All"
      }
      this.genders.push(all);
      if (response.states) {
        this.states = response.states;
      }
    }),(err) => {
      this.alertService.alert(err.errorMessage);
    }

    // this.today = new Date();
    // this.today.setDate(this.today.getDate()-1);

    // this.end_date = new Date();
    // this.end_date.setDate(this.end_date.getDate()-1);
    
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

    this.request_obj={
      "startTimestamp":"",
      "endTimestamp":""}
          this.providerServiceMapID = this.dataService.current_service.serviceID;

    }


    GetDistricts(state) {
      this.districts = [];
      this.district = undefined;
      if (state) {
        this._locationService.getDistricts(state.stateID)
        .subscribe((response) => this.SetDistricts(response), (err) => {
          this.alertService.alert(err.errorMessage);

         });
      }
    }

    SetDistricts(response: any) {
      this.districts = response;
    }

    blockKey(e: any){
      if(e.keyCode===9){
        return true;
      }
      else {
        return false;
      }
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
      this.genderDistributionSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
    if(diffDays < 0) {
      var tempDate = new Date(this.start_date);
      tempDate.setHours(23,59,59,0);
      this.genderDistributionSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
  }
    getReports(form_values){
    //call api and initialize data
    this.request_array=[];
    console.log(form_values.gender,"GENDER ARRAY CONDITION");
    if(form_values.gender == "All")
    {

    for(let i=0;i<this.genders.length-1;i++)
    {
      var obj=Object.assign({},this.request_obj);
      obj['gender']=this.genders[i].genderName;
      obj['providerServiceMapID'] = this.providerServiceMapID;

      obj['startTimestamp']=new Date((form_values.startDate) - 1 * (form_values.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";

      obj['endTimestamp']=new Date((form_values.endDate) - 1 * (form_values.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";

      if(form_values.state)
      {
        obj['state']=form_values.state.stateName;
      }

      if(form_values.district)
      {
        obj['district']=form_values.district;
      }

      this.request_array.push(obj);
    }


    console.log("request array",this.request_array);
  }
  else
  {
    /*assign all genders if no gender was selected*/
     // for(let i=0;i<form_values.gender.length;i++)
     // {
      /*selected genders*/
      var obj=Object.assign({},this.request_obj);
      obj['gender']=form_values.gender;
      obj['providerServiceMapID'] = this.providerServiceMapID;
      obj['startTimestamp']=new Date((form_values.startDate) - 1 * (form_values.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";

      obj['endTimestamp']=new Date((form_values.endDate) - 1 * (form_values.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";

      if(form_values.state)
      {
        obj['state']=form_values.state.stateName;
      }

      if(form_values.district)
      {
        obj['district']=form_values.district;
      }

      this.request_array.push(obj);
   // }

    console.log("request array",this.request_array);
  }


  this.reportsService.getAllByGender(this.request_array)
  .subscribe(response=>this.getReportSuccessHandeler(response),
(err) => {
  this.alertService.alert(err.errorMessage);

});

}


getReportSuccessHandeler(response)
{

  if(response)
  {
    this.tableFlag = true;
    console.log(response,"REPORT SUCCESS");
    this.gender_distribution_resultset=response;
  }
  else
  {
    this.alertService.alert(response.status,'error');
  }
}

download_report()
{
  var head=Object.keys(this.gender_distribution_resultset[0]);
  new Angular2Csv(this.gender_distribution_resultset, 'Gender Distribution Report', {headers: (head)});
              this.alertService.alert('Gender distribution report downloaded','success');

}


}
