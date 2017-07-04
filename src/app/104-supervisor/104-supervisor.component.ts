import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-104-supervisor',
  templateUrl: './104-supervisor.component.html',
  styleUrls: ['./104-supervisor.component.css']
})
export class Supervisor_104_Component implements OnInit {

	constructor() { };

	ngOnInit() { };

	// tab: number = 1;

	// changeService(val) {
	// 	this.tab = val;
	// 	jQuery("#service" + val).parent().find("li").removeClass();
	// 	jQuery("#service" + val).addClass("animation-nav-active");

	// 	jQuery("#service" + val).parent().find('a').removeClass();
	// 	jQuery("#service" + val + " a").addClass("f-c-o");
	// }

	Activity_Number:any;

	show(value)
  	{
  		this.Activity_Number=value;
  	}
}
