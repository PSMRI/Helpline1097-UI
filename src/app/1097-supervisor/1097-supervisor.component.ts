import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-1097-supervisor',
  templateUrl: './1097-supervisor.component.html',
  styleUrls: [ './1097-supervisor.component.css' ]
} )
export class helpline1097SupervisorComponent implements OnInit
{

  // barMinimized: boolean = false;
  constructor() { }

  ngOnInit ()
  {
  }
  Activity_Number: any;

  show ( value )
  {
    this.Activity_Number = value;
  }
}
