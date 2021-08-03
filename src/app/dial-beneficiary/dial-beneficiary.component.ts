import { Component, OnInit } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component( {
  selector: 'app-dial-beneficiary',
  templateUrl: './dial-beneficiary.component.html',
  styleUrls: [ './dial-beneficiary.component.css' ]
} )
export class DialBeneficiaryComponent implements OnInit
{
  currentLanguageSet: any;

  constructor(private HttpServices:HttpServices ) { }

  ngOnInit ()
  {
    this.assignSelectedLanguage();

  }

  resultsFound: boolean = false;
  phoneNumber: number;
  findBenByPh ()
  {
    this.resultsFound = true;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}
