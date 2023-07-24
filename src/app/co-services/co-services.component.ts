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


import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var jQuery: any;
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-co-services',
  templateUrl: './co-services.component.html',
  styleUrls: ['./co-services.component.css']
})
export class CoServicesComponent implements OnInit {

  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Input() benData: any;
  @Input() resetProvideServices: any;
  selectedBenData: any;
  loadComp = false;
  show: boolean = true;
  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  selectedService: any;
  tab_value: number = 1;
  ngOnInit() {
    this.assignSelectedLanguage();
    jQuery("#md-tab-label-0-0").addClass("mat-tab-label-active");
  }

  selectedIndex:any=0;

  ngOnChanges() {
       if(this.resetProvideServices) {
      jQuery('#feedbackForm').trigger("reset");
      this.show = true;
    }

  }

  updateServiceProvided() {
    this.serviceGiven.emit();
  }

  @Input()
  startCOService() {
    // todo in future
  }
  changeService(val) {
    console.log(val, 'value of tab clicked');
    this.tab_value = val;
   
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
