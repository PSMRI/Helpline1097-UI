import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { dataService } from '../dataService/data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService) { }

  canActivate(route, state) {
    //console.log(route);
    console.log(route);
    console.log(state);
    var key = sessionStorage.getItem("isOnCall");
    var key2 = sessionStorage.getItem("authen");
    if (key == "yes" && key2 == "pass1097") {
      alert("Not allowed to go back, Please complete & close the call");
      return false;
    }
    else if (key2 != "pass1097") {
      alert("Please Login Again");
      return false;
    }
    else {
      return true;
    }
  }

  // canActivateChild() {

  // }

}

