import {Component} from '@angular/core';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
    selector: 'daily-tasks',
    templateUrl: './daily-tasks.component.html',
})
export class DailyTasksComponent{
    currentLanguageSet: any;

    constructor(public HttpServices: HttpServices) { }

    ngOnInit() {
        this.assignSelectedLanguage();
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