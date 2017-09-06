import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-service-role-selection',
 templateUrl: './service-role-selection.component.html',
 styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {
 privleges: any;
 constructor(
  public getCommonData: dataService,
  public router: Router
 ) { }

 ngOnInit() {

  this.privleges = this.getCommonData.userPriveliges;
  // this.privleges[3].roles[1].RoleName = 'Supervisior';
  // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
 }

 route2dashboard(role, service) {
  let roleName = role.RoleName;
  let serviceName = service.serviceName;
  // if ( service === '1097' && ( role === 'CO' || role === 'Supervisior' ) )
  if (serviceName === '1097' && (roleName === 'CO' || roleName === 'Supervisior')) {
   this.getCommonData.current_role = role;
   this.getCommonData.current_service = service;
   this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
   // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard'] } }]);
  }
  // if ( role === 'ADMIN' )
  if (roleName === 'ADMIN') {
   this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['superAdmin'] } }]);
  }
 }

}
