import { Component, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/adminServices/AdminUser/user.service';


enableProdMode();
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  //styleUrls:['../../css/bootstrap.min.css','../../css/custom.css','../../css/font-awesome.css'],
  // templateUrl: '../app.component.html',
providers:[UserService]

})
export class UserComponent implements OnInit {
 userslist:string[];
 data:any;
 constructor(private _UserService: UserService) {
   this.userslist;
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

  
  ngOnInit() 
  {
	  
      this._UserService.getUsers()
	 	.subscribe(resProviderData => this.providers(resProviderData));

  }



onSubmit() {
		//var bodyString=new Object

		let bodyString = this.userForm.value;
		console.log(this.userForm.value)
		this._UserService.saveUser(bodyString)
			.subscribe(resProviderData => this.showUsers(resProviderData));
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
