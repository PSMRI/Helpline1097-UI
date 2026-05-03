/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
  @Output() everwellBeneficiarySelected: EventEmitter<any> = new EventEmitter<any>();  
  @Output() submitBtnCheck : EventEmitter<any> = new EventEmitter<any>();
  current_role: any;
  everwellSubmitBtn: any;
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

  selectEverwellBeneficiary(data: any) {    
    this.everwellBeneficiarySelected.emit(data);
  }
  Activity_Number: any;

  show(value) {
    this.Activity_Number = value;
  }
  checkSubmitBtnStatus(everwellSubmitBtnStatus){
    this.submitBtnCheck.emit(everwellSubmitBtnStatus);
  }
}
