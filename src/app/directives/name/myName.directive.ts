/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myName]",
})
export class myName {
  constructor(element: ElementRef) {}

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

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[0-9 ~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]*$/);
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
@Directive({
  selector: "[myName_space]",
})
export class myName_space {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};':`"\\|,.<>\/?]*$/);
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
