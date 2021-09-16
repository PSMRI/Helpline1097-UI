/*
 * SH20094090 - Created on 27-07-21
 */

import { Component, DoCheck, forwardRef, Inject } from "@angular/core";
import { HttpServices } from "app/services/http-services/http_services.service";


@Component({
  template: "",
})
export class SetLanguageComponent  {
  currentLanguageObject: any;
  constructor(@Inject(forwardRef(() => HttpServices)) public httpServices: HttpServices) {}

  
  // ngDoCheck() {
  //   this.setLanguage();
  // }

  setLanguage() {
    const languageSubscription = this.httpServices.currentLangugae$.subscribe(
      (languageResponse) => {
        this.currentLanguageObject = languageResponse;
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log("completed");
      }
    );
    languageSubscription.unsubscribe();
  }
}
