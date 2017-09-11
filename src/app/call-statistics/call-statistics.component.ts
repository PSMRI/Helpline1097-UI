import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CzentrixServices } from './../services/czentrix/czentrix.service'

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

	constructor(private callService: CzentrixServices) { };

	todayCallLists() {
		this.totalCalls = 'Total Calls : 122';
		this.totalInvalidCalls = 'Total Invalid Calls : 34';
		this.totalCallDuration = 'Total Call Duration : 00:00:22';
		this.totalBreakTime = 'Total Break Time : 00:00:12';
		this.totalFreeTime = 'Total Free Time : 00:00:10';
		this.callService.getTodayCallReports().subscribe((response) => {

			// 	this.totalCalls = 'Total Calls : ' + response.total_calls;
			// 	this.totalInvalidCalls = 'Total Invalid Calls : ' + response.total_invalid_calls ? 'unavailable' : '0';
			// 	this.totalCallDuration = 'Total Call Duration :' + response.total_call_duration;
			// 	this.totalBreakTime = 'Total Break Time :' + response.total_break_time;
			// 	this.totalFreeTime = 'Total Free Time :' + response.total_free_time;
		}, (err) => {
			console.log('Error in Total Call Report', err);
		})
	}
	close() {
		this.hide_component.emit("6");
	};

}