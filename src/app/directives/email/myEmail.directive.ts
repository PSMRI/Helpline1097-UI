import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myEmail]'
})
export class myEmail {
	constructor(element: ElementRef) {

	}

	private emailValidator(email: any) {
		if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
			return 1
		}
		else {
			return -1;
		}
	}

	@HostListener('keyup', ['$event']) onKeyUp(ev: any) {

		var result = this.emailValidator(ev.target.value);
		if (result == 1) {
			ev.target.nextSibling.nextElementSibling.innerHTML = "Valid email";
			ev.target.style.border = "2px solid green";
		}

		if (result == -1) {
			ev.target.nextSibling.nextElementSibling.innerHTML = "invalid email";
			ev.target.style.border = "2px solid red";
		}

	}



}