import { Component, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicemasterService } from '../services/adminServices/AdminService/servicemaster.service';

@Component({
  selector: 'app-admin-service-master',
  templateUrl: './admin-service-master.component.html',
  styleUrls: ['./admin-service-master.component.css']
})
export class AdminServiceMasterComponent implements OnInit {

 userslist:string[];
 data:any;
 constructor(private _ServicemasterService: ServicemasterService) {
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
     this._ServicemasterService.getServiceMaster()
		 	.subscribe(resProviderData => this.providers(resProviderData));

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
