import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-multi-role-screen',
  templateUrl: './multi-role-screen.component.html',
  styleUrls: ['./multi-role-screen.component.css']
})
export class MultiRoleScreenComponent implements OnInit {

  constructor(public getCommonData: dataService, public router: Router) { }

  data: any;
  ngOnInit() {
    this.data = this.getCommonData.Userdata;
    // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
    // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
  }

}
