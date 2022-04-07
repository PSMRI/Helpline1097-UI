import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myPassword]",
})
export class myPassword {
  constructor(element: ElementRef) {}

  private passwordValidator(password: any) {
    if (password.match(/^[a-zA-Z]{1,1}[a-zA-Z0-9 $%#@!&^*()+{}\[\]-]{7,11}$/)) {
      if (password.length >= 8) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return -1;
    }
  }

  @HostListener("keyup", ["$event"]) onKeyUp(ev: any) {
    var result = this.passwordValidator(ev.target.value);
    if (result == 1) {
      ev.target.nextSibling.nextElementSibling.innerHTML = "Strong Password";
      ev.target.style.border = "2px solid green";
    }
    if (result == 0) {
      ev.target.nextSibling.nextElementSibling.innerHTML = "Weak Password";
      ev.target.style.border = "2px solid yellow";
    }

    if (result == -1) {
      ev.target.nextSibling.nextElementSibling.innerHTML =
        "password should be 8-12 characters long and must start with an alphabet and can have numbers alphabets and $%#@!&^*()-+{}[]";
      ev.target.style.border = "2px solid red";
    }
  }

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[\s]*$/);
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
