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
var myEmail = (function () {
    function myEmail(element) {
    }
    myEmail.prototype.emailValidator = function (email) {
        if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            return 1;
        }
        else {
            return -1;
        }
    };
    myEmail.prototype.onKeyUp = function (ev) {
        var result = this.emailValidator(ev.target.value);
        if (result == 1) {
            ev.target.nextSibling.nextElementSibling.innerHTML = "Valid email";
            ev.target.style.border = "2px solid green";
        }
        if (result == -1) {
            ev.target.nextSibling.nextElementSibling.innerHTML = "invalid email";
            ev.target.style.border = "2px solid red";
        }
    };
    __decorate([
        core_1.HostListener('keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], myEmail.prototype, "onKeyUp", null);
    myEmail = __decorate([
        core_1.Directive({
            selector: '[myEmail]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], myEmail);
    return myEmail;
}());
exports.myEmail = myEmail;
//# sourceMappingURL=myEmail.directive.js.map