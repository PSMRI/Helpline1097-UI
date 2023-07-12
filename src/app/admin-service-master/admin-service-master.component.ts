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
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicemasterService } from '../services/adminServices/AdminService/servicemaster.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from '../services/http-services/http_services.service';
@Component({
  selector: 'app-admin-service-master',
  templateUrl: './admin-service-master.component.html',
  styleUrls: ['./admin-service-master.component.css']
})
export class AdminServiceMasterComponent implements OnInit {

 userslist:string[];
 data:any;
	currentLanguageSet: any;
 constructor(private _ServicemasterService: ServicemasterService,private HttpServices:HttpServices) {
   this.userslist;
  }
userForm = new FormGroup({
serviceName: new FormControl(),
serviceDesc:new FormControl(),

 createdBy:new FormControl('test'),
createdDate:new FormControl('2017-05-25'),
modifiedBy:new FormControl('test1'),
lastModDate:new FormControl('2017-05-26')

});
  ngOnInit() {
	this.assignSelectedLanguage();
     this._ServicemasterService.getServiceMaster()
		 	.subscribe(resProviderData => this.providers(resProviderData));

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  onSubmit() {
	
		let bodyString = this.userForm.value;
		console.log(this.userForm.value)
		this._ServicemasterService.saveServiceMaster(bodyString)
			.subscribe(resProviderData => this.showUsers(resProviderData));
	}
	showUsers(data) {
		console.log(JSON.parse(data));
	}

	providers(data) {
    this.userslist=data;
		console.log(data);
	}

}
