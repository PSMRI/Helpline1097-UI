import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { SetLanguageComponent } from 'app/set-language.component';
import { dataService } from '../dataService/data.service';
import { HttpServices } from '../http-services/http_services.service';

@Injectable()
export class AuthGuard2 implements CanActivate {
  currentLanguageSet: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService,
    public httpServices:HttpServices) { }

    ngOnInit() {
      this.assignSelectedLanguage();
    }
  
    ngDoCheck() {
			this.assignSelectedLanguage();
		  }

		assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		 
		 }

  canActivate(route, state) {
    var key = sessionStorage.getItem("isOnCall");
    var key2 = sessionStorage.getItem("authen");
    if (key == "yes") {
      return true;;
    }

    else {
      alert(this.currentLanguageSet.pleseWaitForCallToComeOrLogout);

      return false;
    }
  }

  // canActivateChild() {

  // }

}

