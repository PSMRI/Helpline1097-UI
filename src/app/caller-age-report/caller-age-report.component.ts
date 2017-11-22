import { Component, OnInit } from '@angular/core';

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
  tableFlag: boolean = true;
  data = {};

  constructor() { }

  ngOnInit() {
    this.today = new Date();
    console.log(this.today);
    this.end_date = this.today;
    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate()-7);
    this.minStartDate = new Date();
    this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
    //call api and initialize data
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
    // this.tableFlag = true;
  }

}
