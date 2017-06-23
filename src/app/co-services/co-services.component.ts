import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var jQuery: any;

@Component( {
  selector: 'app-co-services',
  templateUrl: './co-services.component.html',
  styleUrls: [ './co-services.component.css' ]
} )
export class CoServicesComponent implements OnInit
{

  constructor() { }
  selectedService: any;
  tab: number = 1;
  ngOnInit ()
  {
  }

  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();

  updateServiceProvided ()
  {
    this.serviceGiven.emit();
  }

  @Input()
  startCOService ()
  {
    //todo in future
  }
  changeService ( val )
  {
    this.tab = val;
    jQuery( "#service" + val ).parent().find( "li" ).removeClass();
    jQuery( "#service" + val ).addClass( "animation-nav-active" );

    jQuery( "#service" + val ).parent().find( 'a' ).removeClass();
    jQuery( "#service" + val + " a" ).addClass( "f-c-o" );
  }

}
