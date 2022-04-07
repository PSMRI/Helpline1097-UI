import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myMobileNumber]",
})
export class myMobileNumber {
	constructor(element:ElementRef)
	{

	}

	// private mobileNumberValidator(number:any)
	// {
	// 	if (number.match(/^[+]?[0-9]{1,10}$/))
	// 	{
	// 		if(number.length==10)
	// 		{
	// 			return 1;
	// 		}
	// 		else
	// 		{
	// 			return 0;
	// 		}
	// 	}
	// 	else{
	// 		return -1;
	// 	}
	// }

	// @HostListener('keyup', ['$event']) onKeyUp(ev: any)
	// {

	// 	var result = this.mobileNumberValidator(ev.target.value);
	// 	if(result==1)
	// 	{
	// 		ev.target.nextSibling.nextElementSibling.innerHTML = "Valid Number";
	// 		ev.target.style.border = "2px solid green";
	// 	}
	// 	if(result==0)
	// 	{
	// 		ev.target.nextSibling.nextElementSibling.innerHTML = "mobile number should be a 10 digit number";
	// 		ev.target.style.border = "2px solid yellow";
	// 	}
	// 	if(result==-1)
	// 	{
	// 		ev.target.nextSibling.nextElementSibling.innerHTML="Enter only numbers";
	// 		ev.target.style.border = "2px solid red";
	// 	}
		
	// }

	@HostListener('keypress',['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/? ]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	 @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
    event.preventDefault();
  }



}
