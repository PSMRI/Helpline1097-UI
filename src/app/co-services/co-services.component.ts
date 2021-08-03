import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-co-services',
  templateUrl: './co-services.component.html',
  styleUrls: ['./co-services.component.css']
})
export class CoServicesComponent implements OnInit {

  @Output() serviceGiven: EventEmitter<any> = new EventEmitter<any>();
  @Input() benData: any;
  @Input() resetProvideServices: any;
  selectedBenData: any;
  loadComp = false;
  show: boolean = true;
  constructor() { }

  selectedService: any;
  tab_value: number = 1;
  ngOnInit() {

    jQuery("#md-tab-label-0-0").addClass("mat-tab-label-active");
  }

  selectedIndex:any=0;

  ngOnChanges() {
       if(this.resetProvideServices) {
      jQuery('#feedbackForm').trigger("reset");
      this.show = true;
    }

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
