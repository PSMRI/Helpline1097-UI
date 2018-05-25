import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myName]'
})
export class myName {
	constructor(element: ElementRef) {

	}

	// private nameValidator(name: any) {
	// 	if (name.match(/^[a-zA-Z]+$/)) {
	// 		if (name.length >= 2) {
	// 			return 1;
	// 		}
	// 		else {
	// 			return 0;
	// 		}
	// 	}
	// 	else {
	// 		return -1;
	// 	}
	// }

	// @HostListener('keyup', ['$event']) onKeyUp(ev: any) {

	// 	var result = this.nameValidator(ev.target.value);
	// 	if (result == 1) {
	// 		ev.target.nextSibling.nextElementSibling.innerHTML = "Valid Name";
	// 		ev.target.style.border = "2px solid green";
	// 	}
	// 	if (result == 0) {
	// 		ev.target.nextSibling.nextElementSibling.innerHTML = "name should contain atleast 2 characters";
	// 		ev.target.style.border = "2px solid yellow";
	// 	}
		
	// 	if (result == -1) {
	// 		ev.target.nextSibling.nextElementSibling.innerHTML = "Enter only alphabets";
	// 		ev.target.style.border = "2px solid red";
	// 	}

	// }

	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9 ~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}


}
@Directive({
	selector: '[myName_space]'
})
export class myName_space {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}


}