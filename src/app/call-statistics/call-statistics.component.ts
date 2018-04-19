import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { dataService } from './../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-call-statistics',
  templateUrl: './call-statistics.component.html',
})
export class CallStatisticsComponent implements OnInit {
  @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
  public totalCalls;
  public totalInvalidCalls;
  public totalCallDuration;
  public totalFreeTime;
  public totalBreakTime;

  ngOnInit() {
    this.todayCallLists();
  };

  constructor(private callService: CzentrixServices, private commonData: dataService, public alertService: ConfirmationDialogsService) { };

  todayCallLists() {
    // this.totalCalls = 'Total Calls : 122';
    // this.totalInvalidCalls = 'Total Invalid Calls : 34';
    // this.totalCallDuration = 'Total Call Duration : 00:00:22';
    // this.totalBreakTime = 'Total Break Time : 00:00:12';
    // this.totalFreeTime = 'Total Free Time : 00:00:10';
    if (this.commonData.current_role.RoleName.toUpperCase() === 'CO') {
      this.callService.getTodayCallReports().subscribe((response) => {
        this.totalCalls = 'Total Calls : ' + response.response.total_calls;
        this.totalInvalidCalls = 'Total Invalid Calls : ' + (response.response.total_invalid_calls ? 'unavailable' : '0');
        this.totalCallDuration = 'Total Call Duration :' + response.response.total_call_duration;
        this.totalBreakTime = 'Total Break Time :' + response.response.total_break_time;
        this.totalFreeTime = 'Total Free Time :' + response.response.total_free_time;
      }, (err) => {
        this.alertService.alert(err.errorMessage,'error');

        console.log('Error in Total Call Report', err);
      })
    } else {
      this.totalCalls = 'Total No. of Calls in Progress: 0';
      this.totalInvalidCalls = 'Total No. of LoggedIn Users  : 23';
      // this.totalCallDuration = 'Total Call Duration :' + response.response.total_call_duration;
      this.totalBreakTime = 'Total No. Users on Break Time : 2';
      // this.totalFreeTime = 'Total Free Time :' + response.response.total_free_time;
    }
  }
  close() {
    this.hide_component.emit("6");
  };

}