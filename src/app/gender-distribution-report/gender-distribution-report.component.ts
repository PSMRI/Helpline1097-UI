import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';


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
  data = [];
  genders = [];
  providerServiceMapID: any;

  request_obj:any;
  request_array:any=[];

  constructor(private dataService: dataService,
   private userbeneficiarydata: UserBeneficiaryData,
   private reportsService:ReportsService,
   private alertService:ConfirmationDialogsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.genders = response['m_genders'];
    })
    this.today = new Date();
    console.log(this.today);
    this.end_date = this.today;
    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate()-7);
    this.minStartDate = new Date();
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);

    this.request_obj={
      "startTimestamp":"",
      "endTimestamp":"",
      "gender":""}

    }

    blockKey(e: any){
      if(e.keyCode===9){
        return true;
      }
      else {
        return false;
      }
    }

    endDateChange(){
      console.log(this.end_date);
      this.minStartDate = new Date(this.end_date);
      this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
      this.start_date = new Date(this.end_date);
      this.start_date.setMonth(this.start_date.getMonth()-1);
    }

    getReports(form_values){
    //call api and initialize data
    this.request_array=[];
    for(let i=0;i<form_values.gender.length;i++)
    {
      var obj=Object.assign({},this.request_obj);
      obj['gender']=form_values.gender[i];

      obj['startTimestamp']=new Date((form_values.startDate) - 1 * (form_values.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";

      obj['endTimestamp']=new Date((form_values.endDate) - 1 * (form_values.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";


      this.request_array.push(obj);
    }
    console.log("request array",this.request_array);

    this.reportsService.getAllByGender(this.request_array)
    .subscribe(response=>this.getReportSuccessHandeler(response));

  }

  getReportSuccessHandeler(response)
  {

    if(response.statusCode===200)
    {
      this.tableFlag = true;
      console.log(response,"REPORT SUCCESS");
    }
    else
    {
      this.alertService.alert(response.status);
    }
  }
}
