import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var jQuery: any;
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

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
  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  selectedService: any;
  tab_value: number = 1;
  ngOnInit() {
    this.assignSelectedLanguage();
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
   
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
