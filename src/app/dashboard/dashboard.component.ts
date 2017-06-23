import { Component,OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';



@Component({
    selector:'dashboard-component',
    templateUrl: './dashboard.html'
})

export class dashboardContentClass implements OnInit {
  data: any;
  constructor(public dataSettingService: dataService) { };
  ngOnInit()
  {
    this.data = this.dataSettingService.Userdata;
  }

 
}
