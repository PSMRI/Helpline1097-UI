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


import { Component, OnInit } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
	currentLanguageSet: any;

  constructor(public httpServices:HttpServices) { }

  ngOnInit() {

	this.assignSelectedLanguage();
  }

  ngDoCheck() {
	this.assignSelectedLanguage();
  }

assignSelectedLanguage() {
	const getLanguageJson = new SetLanguageComponent(this.httpServices);
	getLanguageJson.setLanguage();
	this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  

  show1: boolean = true;
  show2: boolean = false;
  show3: boolean = false;
  show4: boolean = false;
  show5: boolean = false;
  show6: boolean = false;

  changeService(val) {
	  console.log(val);
	  if (val === "1") {
		  this.show1 = true;
		  this.show2 = false;
		  this.show3 = false;
		  this.show4 = false;
		  this.show5 = false;
		  this.show6 = false;
		  
	  }
	  if (val === "2") {
		  this.show1 = false;
		  this.show2 = true;
		  this.show3 = false;
		  this.show4 = false;
		  this.show5 = false;
		  this.show6 = false;
	  }
	  if (val === "3") {
		  this.show1 = false;
		  this.show2 = false;
		  this.show3 = true;
		  this.show4 = false;
		  this.show5 = false;
		  this.show6 = false;
	  }
	  if (val === "4") {
		  this.show1 = false;
		  this.show2 = false;
		  this.show3 = false;
		  this.show4 = true;
		  this.show5 = false;
		  this.show6 = false;
	  }
	  if (val === "5") {
		  this.show1 = false;
		  this.show2 = false;
		  this.show3 = false;
		  this.show4 = false;
		  this.show5 = true;
		  this.show6 = false;
	  }
	  	  if (val === "6") {
		  this.show1 = false;
		  this.show2 = false;
		  this.show3 = false;
		  this.show4 = false;
		  this.show5 = false;
		  this.show6 = true;
	  }
  }

}
