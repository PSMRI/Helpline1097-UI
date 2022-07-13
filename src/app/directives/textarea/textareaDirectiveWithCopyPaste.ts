import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[textAreaValidatorWithCopyPaste]",
})
// this directive allows [0-9a-zA-Z&.,-]
export class textareaDirectiveWithCopyPaste {
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    const regex = new RegExp(/^[~!@#$%^*()+\=\[\]{};"`':'\\|<>\/?]*$/);
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    } 
  }
  @HostListener("paste", ["$event"]) blockPaste(ev: any,event: KeyboardEvent) {
    let clipboardData =(ev !=undefined) ? ev.clipboardData : undefined;
    let pastedText = (clipboardData !=undefined) ? (clipboardData.getData('text')) : undefined;
    const regex = new RegExp(/^[~!@#$%^*()+\=\[\]{};"`':'\\|<>\/?]*$/);
   // const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    let flag=false;
    if(pastedText !=null && pastedText != undefined && pastedText.length >0)
    {
      Array.from(pastedText).forEach(element => {
        if (element !=null && element !=undefined && regex.test(element.toString())) {
              flag=true;
            }
      });
    }
    if(flag)
    ev.preventDefault();
} 

  // @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
  //   event.preventDefault();
  // }

//   @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
//     event.preventDefault();
//   }
}
