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


import {
  Directive,
  ElementRef,
  Attribute,
  HostListener,
  Input,
} from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Directive({
  selector:
    "[allowText][formControlName],[allowText][formControl],[allowText][ngModel],[allowText]",
})
export class StringValidator {
  @Input()
  allowText: string;

  inputFieldValidator = /^[a-zA-Z0-9 ]+$/;
  textAreaValidator = /^[a-zA-Z0-9., ]+$/;
  questionnaireValidator = /^[a-zA-Z0-9.,? ]+$/;
  addressValidator = /^[a-zA-Z0-9.,/\-# ]+$/;
  smsTemplateValidator = /^[a-zA-Z0-9.,$\-:;/() ]+$/;
  itemNameSearchValidator = /^[a-zA-Z0-9% ]+$/;
  itemNameMasterValidator = /^[a-zA-Z0-9%-.[\]\/() ]+$/;
  answerValidator = /^[a-zA-Z0-9.,/\- ]+$/;
  usernameValidator = /^[a-zA-Z0-9]+$/;
  searchIdValidator = /^[a-zA-Z0-9/]+$/;

  lastValue = null;
  result: boolean;

  constructor(private elementRef: ElementRef) {}

  validate(input) {
    let patternCode = this.allowText.trim();

    if (input == null || input == "") return false;

    switch (patternCode) {
      case "inputFieldValidator":
        this.result = this.inputFieldValidator.test(input);
        break;
      case "textAreaValidator":
        this.result = this.textAreaValidator.test(input);
        break;
      case "questionnaireValidator":
        this.result = this.questionnaireValidator.test(input);
        break;
      case "addressValidator":
        this.result = this.addressValidator.test(input);
        break;
      case "smsTemplateValidator":
        this.result = this.smsTemplateValidator.test(input);
        break;
      case "itemNameSearchValidator":
        this.result = this.itemNameSearchValidator.test(input);
        break;
      case "itemNameMasterValidator":
        this.result = this.itemNameMasterValidator.test(input);
        break;
      case "answerValidator":
        this.result = this.answerValidator.test(input);
        break;
      case "usernameValidator":
        this.result = this.usernameValidator.test(input);
        break;
      case "searchIdValidator":
        this.result = this.searchIdValidator.test(input);
        break;
      default:
        this.result = false;
    }
    return this.result;
  }

  @HostListener("input", ["$event"])
  onInput(event: any) {
    let val = event.target.value;
    let lastVal = this.lastValue;
    let maxlength = event.target.maxLength;

    if (this.allowText.trim() == "decimal") {
      if (val == "") {
        event.target.value = "";
      } else if (!this.validate(val)) {
        event.target.value = lastVal;
      }
    } else if (this.allowText.trim() == "number") {
      if (event.target.length > 0) {
        this.validateEntry(val, lastVal, maxlength, event);
      } else {
        this.checkForZeroEntry(val, lastVal, maxlength, event);
      }
    } else {
      this.validateEntry(val, lastVal, maxlength, event);
    }
    this.lastValue = event.target.value;
  }
  validateEntry(val, lastVal, maxlength, event) {
    var inserted = this.findDelta(val, lastVal);
    // get removed chars
    var removed = this.findDelta(lastVal, val);
    // determine if user pasted content
    var pasted = inserted.length >= 1 || (!inserted && !removed);

    if (maxlength > 0 && val.length > maxlength) {
      event.target.value = lastVal;
    } else {
      if (pasted) {
        if (!this.isValidString(val)) event.target.value = lastVal;
      } else if (!removed) {
        if (!this.isValidChar(inserted)) event.target.value = lastVal;
      }
    }
  }
  checkForZeroEntry(val, lastVal, maxlength, event) {
    console.log(
      "val, lastVal, maxlength, event",
      val,
      lastVal,
      maxlength,
      event
    );
    if (val == "0") {
      event.target.value = "";
    } else {
      this.validateEntry(val, lastVal, maxlength, event);
    }
  }

  @HostListener("focus", ["$event"])
  onFocus(event: any) {
    let input = event.target.value;
    this.lastValue = input;
  }

  findDelta(value, prevValue) {
    let delta = "";

    for (let i = 0; i < value.length; i++) {
      let str =
        value.substr(0, i) + value.substr(i + value.length - prevValue.length);

      if (str === prevValue)
        delta = value.substr(i, value.length - prevValue.length);
    }

    return delta;
  }

  isValidChar(c) {
    return this.validate(c);
  }

  isValidString(str) {
    for (let i = 0; i < str.length; i++)
      if (!this.isValidChar(str.substr(i, 1))) return false;
    return true;
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
