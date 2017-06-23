import { Component, OnInit } from '@angular/core';

import { RoleService } from '../services/adminServices/AdminRole/Role.service';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-admin-role-master',
  templateUrl: './admin-role-master.component.html',
  styleUrls: ['./admin-role-master.component.css']
})
export class AdminRoleMasterComponent implements OnInit {

userslist:string[];
 data:any;
 constructor(private _RoleService:RoleService) {
   this.userslist;
  }
userForm = new FormGroup({
roleName: new FormControl(),
roleDesc:new FormControl(),


createdBy:new FormControl('test'),
createdDate:new FormControl('2017-05-25'),
modifiedBy:new FormControl('test1'),
lastModDate:new FormControl('2017-05-26')

});

  ngOnInit() {
    this._RoleService.getRole()
		 	.subscribe(resProviderData => this.providers(resProviderData));
  }

onSubmit() {
	
		let bodyString = this.userForm.value;
		console.log(this.userForm.value)
		this._RoleService.saveRole(bodyString)
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
