import { DoCheck } from "@angular/core";
import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import { CzentrixServices } from "../services/czentrix/czentrix.service";
import { dataService } from "./../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";

@Component({
  selector: "app-call-statistics",
  templateUrl: "./call-statistics.component.html",
})
export class CallStatisticsComponent implements OnInit, DoCheck {
  @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
  public totalCalls;
  public totalInvalidCalls;
  public totalCallDuration;
  public totalFreeTime;
  public totalBreakTime;
  current_date: any;
  assignSelectedLanguageValue: any;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.current_date = new Date();
    this.todayCallLists();
  }

  constructor(
    private callService: CzentrixServices,
    private commonData: dataService,
    public alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  todayCallLists() {
    this.callService.getCallDetails().subscribe(
      (response) => {
        console.log("RESPONSE OF CALL DETAILS", response);
        this.totalCalls = response.data.total_calls;
        this.totalInvalidCalls = response.data.total_invalid_calls;
        this.totalCallDuration = response.data.total_call_duration;
        this.totalBreakTime = response.data.total_break_time;
        this.totalFreeTime = response.data.total_free_time;
        console.log(
          this.totalCalls,
          this.totalInvalidCalls,
          this.totalCallDuration,
          this.totalBreakTime,
          this.totalFreeTime
        );
      },
      (err) => {
        console.log("Error in Total Call Report", err);
      }
    );
  }
  close() {
    this.hide_component.emit("6");
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
