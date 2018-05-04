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
  current_date: any;

  ngOnInit() {
    this.current_date = new Date();
    this.todayCallLists();
  };

  constructor(private callService: CzentrixServices,
    private commonData: dataService,
    public alertService: ConfirmationDialogsService) { };

  todayCallLists() {

    this.callService.getCallDetails().subscribe(response => {
      console.log('RESPONSE OF CALL DETAILS', response);
      this.totalCalls = response.data.total_calls;
      this.totalInvalidCalls = response.data.total_invalid_calls;
      this.totalCallDuration = response.data.total_call_duration;
      this.totalBreakTime = response.data.total_break_time;
      this.totalFreeTime = response.data.total_free_time;
      console.log(this.totalCalls, this.totalInvalidCalls, this.totalCallDuration, this.totalBreakTime, this.totalFreeTime);
    }, (err) => {
      console.log('Error in Total Call Report', err);
    });

  }
  close() {
    this.hide_component.emit("6");
  };

}
