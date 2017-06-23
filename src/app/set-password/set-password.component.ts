import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

	constructor(public http_calls: HttpServices, public getUserData: dataService, public router: Router) { }

  ngOnInit() {
  }

  newpwd: any;
  confirmpwd: any;

  uname: any = this.getUserData.uname;


  updatePassword(new_pwd) {
	  if (new_pwd === this.confirmpwd) {
			this.http_calls.postData(" http://10.152.3.152:1040/Common/user/setForgetPassword", 
										{ "userName": this.uname, "password": new_pwd }
									).subscribe(
											(response: any) => this.successCallback(response),
											(error: any) => this.errorCallback(error)
												);
		
		alert("password is changed for user " + this.uname + " wd new pwd as : " + new_pwd);
	  }
	  else {
		  alert("password dsnt match");
	  }
  }

  successCallback(response) {

	  console.log(response);
	  this.router.navigate(['/loginContentClass']);
  }
  errorCallback(response) {
	  console.log(response);
  }


}
