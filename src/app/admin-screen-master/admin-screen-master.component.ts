import { Component, OnInit } from '@angular/core';
import {ScreenService} from '../services/adminServices/AdminScreen/screen.service'
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-admin-screen-master',
  templateUrl: './admin-screen-master.component.html',
  styleUrls: ['./admin-screen-master.component.css']
})
export class AdminScreenMasterComponent implements OnInit {

 userslist:string[];
 data:any;
 constructor(private _ScreenService: ScreenService) {
   this.userslist;
  }
  userForm = new FormGroup({
screenName: new FormControl(),
workflowName:new FormControl(),
screenDesc: new FormControl(),

createdBy:new FormControl('test'),
createdDate:new FormControl('2017-05-25'),
modifiedBy:new FormControl('test1'),
lastModDate:new FormControl('2017-05-26')

});
  ngOnInit() {
     this._ScreenService.getScreen()
		 	.subscribe(resProviderData => this.providers(resProviderData));
  }
  onSubmit() {
	
		let bodyString = this.userForm.value;
		console.log(this.userForm.value)
		this._ScreenService.saveScreen(bodyString)
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
