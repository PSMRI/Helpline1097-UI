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
import { SPService } from '../services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { UserService } from '../services/adminServices/AdminUser/user.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  providers:[UserService]

})
export class AdminUserComponent implements OnInit {
  	public showCreateFlag=false;
  userslist:string[];
  data:any;
	currentLanguageSet: any;
  
constructor(private _UserService: UserService,private HttpServices:HttpServices) { 
  this.userslist;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
userForm = new FormGroup({
firstName: new FormControl(),
middleName:new FormControl(),
lastName: new FormControl(),
titleID:new FormControl('1'),
userName:new FormControl(), 
password :new FormControl(),
statusID  :new FormControl('1'),
createdBy:new FormControl('test'),
createdDate:new FormControl('2017-05-25'),
modifiedBy:new FormControl('test1'),
lastModDate:new FormControl('2017-05-26')
// UserID:new FormControl(),
// GenderID:new FormControl(),
// MaritalStatusID:new FormControl(),
// AadhaarNo:new FormControl(),
// PAN:new FormControl(),
// DOB:new FormControl(),
// DOJ :new FormControl(),
// QualificationID:new FormControl(), 
// EmailID :new FormControl(),
// EmergencyContactPerson:new FormControl(), 
// EmergencyContactNo:new FormControl(),  
// IsSupervisor :new FormControl(),
// Deleted:new FormControl(),
});

  ngOnInit() {
	this.assignSelectedLanguage();
      this._UserService.getUsers()
	 	.subscribe(resProviderData => this.providers(resProviderData));
  }
  showCreate(){
		this.showCreateFlag=!this.showCreateFlag;
	}
  onSubmit() {

		let bodyString = this.userForm.value;
		console.log(this.userForm.value)
		this._UserService.saveUser(bodyString)
			.subscribe(resProviderData => this.showUsers(resProviderData));
		this.showCreate();
	}
	showUsers(data) {
		console.log(JSON.parse(data));
	}

	providers(data) {
    this.userslist=data;
		console.log(data);
	}
	;


}
