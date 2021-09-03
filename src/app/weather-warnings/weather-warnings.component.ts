import {Component, DoCheck} from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
    selector: 'weather-warnings',
    templateUrl: './weather-warnings.component.html',
})
export class WeatherWarningsComponent implements DoCheck{
    currentLanguageSet: any;
    constructor(private httpServices: HttpServices) { }
    
    ngOnInit() {
       this.assignSelectedLanguage();
    }
    ngDoCheck() {
        this.assignSelectedLanguage();
      }
    assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
}