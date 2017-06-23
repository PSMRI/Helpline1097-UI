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
var myPassword = (function () {
    function myPassword(element) {
    }
    myPassword.prototype.passwordValidator = function (password) {
        if (password.match(/^[a-zA-Z]{1,1}[a-zA-Z0-9 $%#@!&^*()+{}\[\]-]{7,11}$/)) {
            if (password.length >= 8) {
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
    myPassword.prototype.onKeyUp = function (ev) {
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
            ev.target.nextSibling.nextElementSibling.innerHTML = "password should be 8-12 characters long and must start with an alphabet and can have numbers alphabets and $%#@!&^*()-+{}[]";
            ev.target.style.border = "2px solid red";
        }
    };
    myPassword.prototype.onKeyPress = function (ev) {
        var regex = new RegExp(/^[\s]*$/);
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
    ], myPassword.prototype, "onKeyUp", null);
    __decorate([
        core_1.HostListener('keypress', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], myPassword.prototype, "onKeyPress", null);
    myPassword = __decorate([
        core_1.Directive({
            selector: '[myPassword]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], myPassword);
    return myPassword;
}());
exports.myPassword = myPassword;
//# sourceMappingURL=myPassword.directive.js.map