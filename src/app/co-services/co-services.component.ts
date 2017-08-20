import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-co-services',
  templateUrl: './co-services.component.html',
  styleUrls: ['./co-services.component.css']
})
export class CoServicesComponent implements OnInit {
  @Input() benHistory: any;
  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Output() informationServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  @Output() counsellingServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  selectedBenData: any;
  constructor() { }
  selectedService: any;
  tab_value: number = 1;
  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(benData: any) {
    this.passBenID();
  }

  updateServiceProvided() {
    debugger;

    this.serviceGiven.emit();
    // this.informationServiceProvided.emit(benRegID);
  }
  public passBenID() {

  }

  @Input()
  startCOService() {
    // todo in future
  }
  changeService(val) {
    console.log(val, "value of tab clicked");
    this.tab_value = val;
    // jQuery( "#service" + val ).parent().find( "li" ).removeClass();
    // jQuery( "#service" + val ).addClass( "animation-nav-active" );

    // jQuery( "#service" + val ).parent().find( 'a' ).removeClass();
    // jQuery( "#service" + val + " a" ).addClass( "f-c-o" );
  }
  public InformationAndCounsellingHistory(benID: any) {
    debugger;
    this.informationServiceProvided.emit(benID);
    this.counsellingServiceProvided.emit(benID);
  }

}
