"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var myMobileNumber = (function () {
    function myMobileNumber(element) {
    }
    myMobileNumber.prototype.mobileNumberValidator = function (number) {
        if (number.match(/^[+]?[0-9]{1,10}$/)) {
            if (number.length == 10) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return -1;
        }
    };
    myMobileNumber.prototype.onKeyUp = function (ev) {
        var result = this.mobileNumberValidator(ev.target.value);
        if (result == 1) {
            ev.target.nextSibling.nextElementSibling.innerHTML = "Valid Number";
            ev.target.style.border = "2px solid green";
        }
        if (result == 0) {
            ev.target.nextSibling.nextElementSibling.innerHTML = "mobile number should be a 10 digit number";
            ev.target.style.border = "2px solid yellow";
        }
        if (result == -1) {
            ev.target.nextSibling.nextElementSibling.innerHTML = "Enter only numbers";
            ev.target.style.border = "2px solid red";
        }
    };
    myMobileNumber.prototype.onKeyPress = function (ev) {
        var regex = new RegExp(/^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
        var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
        if (regex.test(key)) {
            ev.preventDefault();
        }
    };
    __decorate([
        core_1.HostListener('keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], myMobileNumber.prototype, "onKeyUp", null);
    __decorate([
        core_1.HostListener('keypress', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], myMobileNumber.prototype, "onKeyPress", null);
    myMobileNumber = __decorate([
        core_1.Directive({
            selector: '[myMobileNumber]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], myMobileNumber);
    return myMobileNumber;
}());
exports.myMobileNumber = myMobileNumber;
//# sourceMappingURL=myMobileNumber.directive.js.map