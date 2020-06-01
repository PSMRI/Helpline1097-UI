import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-outbound-call-worklists',
  templateUrl: './outbound-call-worklists.component.html',
  styleUrls: ['./outbound-call-worklists.component.css']
})
export class OutboundCallWorklistsComponent implements OnInit {

  constructor() { }
  selectedIndex:any=0;
  ngOnInit() {
  }

}
