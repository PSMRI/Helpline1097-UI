import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-role-selection',
  templateUrl: './service-role-selection.component.html',
  styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {

	constructor(public getCommonData: dataService, public router: Router) { }
  privleges: any;

  ngOnInit() {
	  this.privleges = this.getCommonData.userPriveliges;
	  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
  }

  route2dashboard(role) {
	  if (role === 'CO') {
		  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard'] } }]);
	  }
	  if (role === 'ADMIN') {
		  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['superAdmin'] } }]);
	  }
  }

}
