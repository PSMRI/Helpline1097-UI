import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';

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
  postData: any;

  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData, private reportsService: ReportsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.sexualOrientations = response['sexualOrientations'];
    })
    this.today = new Date();
    console.log(this.today);
    this.end_date = this.today;
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

  endDateChange(){
    console.log(this.end_date);
    this.minStartDate = new Date(this.end_date);
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
    this.start_date = new Date(this.end_date);
    this.start_date.setMonth(this.start_date.getMonth()-1);
  }

  getReports(){
    console.log("values:", this.sexualOrientationSearchForm.value);
    //call api and initialize data
    // this.reportsService.getAllBySexualOrientation()
    this.tableFlag = true;
  }

}
