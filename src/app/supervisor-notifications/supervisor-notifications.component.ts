import { Component, OnInit } from '@angular/core';

declare var jQuery:any;


@Component({
  selector: 'app-supervisor-notifications',
  templateUrl: './supervisor-notifications.component.html',
  styleUrls: ['./supervisor-notifications.component.css']
})
export class SupervisorNotificationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  agent:any;
  recipientArray:any=[];
  notification:any="";
  
  findAgent(agentName:any)
  {
  	this.agent="";
  	this.recipientArray.push(agentName);
  }

  deleteRecipient(agentindex:any)
  {
  	console.log(agentindex);
  	this.recipientArray.splice(agentindex,1);
  }

  len:any=0;
  updateCount()
  {
     // jQuery("#count").text("Characters left: " + (500 - jQuery("#notification").val().length));
      jQuery("#count").text( jQuery("#notification").val().length+"/500");
  }
}
