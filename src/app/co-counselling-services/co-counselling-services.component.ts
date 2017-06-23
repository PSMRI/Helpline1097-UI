import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component( {
  selector: 'app-co-counselling-services',
  templateUrl: './co-counselling-services.component.html',
  styleUrls: [ './co-counselling-services.component.css' ]
} )
export class CoCounsellingServicesComponent implements OnInit
{
  @Output() counsellingServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit ()
  {
  }

}
