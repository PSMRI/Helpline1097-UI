import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { loginService } from '../services/loginService/login.service';
import { AuthService } from '../services/authentication/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'app-set-password',
	templateUrl: './set-password.component.html',
	styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

	passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
	key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  encryptedConfirmPwd : any;

	constructor(
		public http_calls: HttpServices,
		public getUserData: dataService,
		private configService: ConfigService,
		private authService: AuthService,
		private loginService: loginService,
		public router: Router, private alertService: ConfirmationDialogsService,
		public loginservice: loginService) {
			this._keySize = 256;
            this._ivSize = 128;
            this._iterationCount = 1989;
		 }

	ngOnInit() {
	}
	
	newpwd: any;
	confirmpwd: any;
	password: any;

	uname: any = this.getUserData.uname;

	dynamictype: any = "password";

	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD() {
		this.dynamictype = 'password';
	}

	get keySize() {
		return this._keySize;
	  }
	
	  set keySize(value) {
		this._keySize = value;
	  }
	
	
	
	  get iterationCount() {
		return this._iterationCount;
	  }
	
	
	
	  set iterationCount(value) {
		this._iterationCount = value;
	  }
	
	
	
	  generateKey(salt, passPhrase) {
		return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
			hasher: CryptoJS.algo.SHA512,
		  keySize: this.keySize / 32,
		  iterations: this._iterationCount
		})
	  }
	
	
	
	  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
		let key = this.generateKey(salt, passPhrase);
		let encrypted = CryptoJS.AES.encrypt(plainText, key, {
		  iv: CryptoJS.enc.Hex.parse(iv)
		});
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	  }
	
	  encrypt(passPhrase, plainText) {
		let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
		let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
		let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
		return salt + iv + ciphertext;
	  }

	updatePassword(new_pwd) {
		let transactionId=this.loginservice.transactionId;
		console.log("PARTH****"+ new_pwd)
		this.password = this.encrypt(this.Key_IV, new_pwd)
		this.encryptedConfirmPwd=this.encrypt(this.Key_IV, this.confirmpwd)
		if (new_pwd === this.confirmpwd) {
			this.http_calls.postDataForSecurity(this.configService.getOpenCommonBaseURL() + 'user/setForgetPassword',
			{ 'userName': this.uname, 'password': this.password, 'transactionId': transactionId }
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
