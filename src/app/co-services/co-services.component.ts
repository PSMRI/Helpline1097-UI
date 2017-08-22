import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-co-services',
  templateUrl: './co-services.component.html',
  styleUrls: ['./co-services.component.css']
})
export class CoServicesComponent implements OnInit {

  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Input() current_language: any;
  @Input() benData: any;
  currentlanguage: any;
  selectedBenData: any;
  loadComp = false;
  constructor() { }

  selectedService: any;
  tab_value: number = 1;
  ngOnInit() {
  }

  ngOnChanges() {
    this.setLanguage(this.current_language);
  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language co services tk');
  }

  updateServiceProvided() {
    this.serviceGiven.emit();
  }

  @Input()
  startCOService() {
    // todo in future
  }
  changeService(val) {
    console.log(val, 'value of tab clicked');
    this.tab_value = val;
    // jQuery( "#service" + val ).parent().find( "li" ).removeClass();
    // jQuery( "#service" + val ).addClass( "animation-nav-active" );

    // jQuery( "#service" + val ).parent().find( 'a' ).removeClass();
    // jQuery( "#service" + val + " a" ).addClass( "f-c-o" );
  }

}
