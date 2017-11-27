import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot, CanDeactivate  } from '@angular/router';
import { dataService } from '../dataService/data.service';

@Injectable()
export class AuthGuard2 implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService) { }

  canActivate(route, state) {
    console.log(route);

    console.log(state);
    var key = sessionStorage.getItem("isOnCall");
    var key2  = sessionStorage.getItem("authen");
    if(key == "yes") {
      return true;;
    }

    else {
    	      alert("Plese wait for call to come or Logout");

      return false;
    }
  }

  // canActivateChild() {

  // }

}

