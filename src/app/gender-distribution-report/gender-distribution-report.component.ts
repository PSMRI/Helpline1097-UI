import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';

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

  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData) { }

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
    //call api and initialize data
    this.tableFlag = true;
  }
}
