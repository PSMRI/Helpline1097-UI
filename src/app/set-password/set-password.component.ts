import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { loginService } from '../services/loginService/login.service';
import { AuthService } from '../services/authentication/auth.service';

@Component({
	selector: 'app-set-password',
	templateUrl: './set-password.component.html',
	styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

	passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

	constructor(
		public http_calls: HttpServices,
		public getUserData: dataService,
		private configService: ConfigService,
		private authService: AuthService,
		private loginService: loginService,
		public router: Router, private alertService: ConfirmationDialogsService,
		public loginservice: loginService) { }

	ngOnInit() {
	}
	
	newpwd: any;
	confirmpwd: any;

	uname: any = this.getUserData.uname;

	dynamictype: any = "password";

	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD() {
		this.dynamictype = 'password';
	}

	updatePassword(new_pwd) {
		let transactionId=this.loginservice.transactionId;
		if (new_pwd === this.confirmpwd) {
			this.http_calls.postDataForSecurity(this.configService.getOpenCommonBaseURL() + 'user/setForgetPassword',
			{ 'userName': this.uname, 'password': new_pwd, 'transactionId': transactionId }
			).subscribe(
				(response: any) =>{
					if (response !== undefined && response !== null && response.statusCode == 200)
					this.successCallback(response)
					else
					{
						this.alertService.alert(response.errorMessage, 'error');
					    this.router.navigate(['/resetPassword']);
					}

				},
				 (error: any) => {
					this.alertService.alert(error.errorMessage, 'error');
					this.router.navigate(['/resetPassword']);
		
			   },
			   this.loginservice.transactionId=undefined
	   
				);
		}
		else {
			this.alertService.alert('Password does not match', 'error');
		}
	}

	successCallback(response) {

		console.log(response);
		this.alertService.alert('Password changed successfully', 'success');
		
		
		this.router.navigate(['']);
	}

	errorCallback(response) {
		console.log(response);
	}


}
