import { Component, OnInit } from '@angular/core';
import {LanguageService} from  '../services/adminServices/AdminLanguage/language.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from '../services/http-services/http_services.service';
@Component({
  selector: 'app-admin-language-master',
  templateUrl: './admin-language-master.component.html',
  styleUrls: ['./admin-language-master.component.css']
})
export class AdminLanguageMasterComponent implements OnInit {
 userslist:string[];
 data:any;
	currentLanguageSet: any;
 constructor(private _LanguageService: LanguageService,private HttpServices:HttpServices) {
   this.userslist;
  }
 userForm = new FormGroup({
languageID: new FormControl(),
languageName:new FormControl(),
languageDesc: new FormControl(),
propertyFilePath:new FormControl(),
ivrFilePath:new FormControl(), 
createdBy:new FormControl('test'),
createdDate:new FormControl('2017-05-25'),
modifiedBy:new FormControl('test1'),
lastModDate:new FormControl('2017-05-26')

});

  ngOnInit() {
	this.assignSelectedLanguage();
     this._LanguageService.getLanguage()
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
		this._LanguageService.saveLanguage(bodyString)
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
