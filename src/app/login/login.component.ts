import { Component } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';


@Component({
	selector: 'login-component',
	templateUrl: './login.html',
	styles: ['body{ background:red !important; }']
})

export class loginContentClass {
	model: any = {};
	userID: any;
	password: any;

	constructor(public loginservice: loginService, public router: Router, public dataSettingService: dataService) { };

	login(userId: any, password: any) {
		console.log(userId, password);
		this.loginservice.authenticateUser(userId, password).subscribe(
			(response: any) => this.successCallback(response),
			(error: any) => this.errorCallback(error));
	};

	successCallback(response: any) {
		console.log(response);
		this.dataSettingService.Userdata = response;
		// this.dataSettingService.userPriveliges = response.Previlege;
		this.dataSettingService.userPriveliges = response.previlegeObj;
		this.dataSettingService.uid = response.userID;
		this.dataSettingService.uname = this.userID;
		// console.log( "array" + response.Previlege );
		console.log("array" + response.previlegeObj);

		if (response.isAuthenticated === true && response.Status === "Active") {
			this.router.navigate(['/MultiRoleScreenComponent']);
		}
		if (response.isAuthenticated === true && response.Status === "New") {
			this.router.navigate(['/setQuestions']);
		}
	};
	errorCallback(error: any) {
		console.log(error);
	};


}
