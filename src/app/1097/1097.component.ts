import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-1097',
  templateUrl: './1097.component.html',
  styleUrls: ['./1097.component.css']
})
export class helpline1097Component implements OnInit {
  @Input() current_language: any;
  currentlanguage: any;

  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  current_role: any;
  constructor(
    public getCommonData: dataService
  ) { };

  ngOnInit() {
    this.current_role = this.getCommonData.current_role.RoleName;
  };

  // tab: number = 1; 

  // changeService(val) {
  // 	this.tab = val;
  // 	jQuery("#service" + val).parent().find("li").removeClass();
  // 	jQuery("#service" + val).addClass("animation-nav-active");

  // 	jQuery("#service" + val).parent().find('a').removeClass();
  // 	jQuery("#service" + val + " a").addClass("f-c-o");
  // }


  ngOnChanges() {
    this.setLanguage(this.current_language);
  }

  setLanguage(language) {
    this.currentlanguage = language;
  }



  selectBeneficiary(data: any) {
    this.beneficiarySelected.emit(data);
  }
  Activity_Number: any;

  show(value) {
    this.Activity_Number = value;
  }
}
