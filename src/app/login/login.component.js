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
var login_service_1 = require('../services/loginService/login.service');
var data_service_1 = require('../services/dataService/data.service');
var router_1 = require('@angular/router');
var loginContentClass = (function () {
    function loginContentClass(loginservice, router, dataSettingService) {
        this.loginservice = loginservice;
        this.router = router;
        this.dataSettingService = dataSettingService;
        this.model = {};
    }
    ;
    loginContentClass.prototype.login = function (userId, password) {
        var _this = this;
        console.log(userId, password);
        this.loginservice.authenticateUser(userId, password).subscribe(function (response) { return _this.successCallback(response); }, function (error) { return _this.errorCallback(error); });
    };
    ;
    loginContentClass.prototype.successCallback = function (response) {
        console.log(response);
        this.dataSettingService.Userdata = response;
        if (response.isAuthenticated === 'True') {
            this.router.navigate(['/dashboard']);
        }
        if (response.isAuthenticated === 'True' && response.Role === 'ADMIN') {
            this.router.navigate(['/adminDashboard']);
        }
    };
    ;
    loginContentClass.prototype.errorCallback = function (error) {
        console.log(error);
    };
    ;
    loginContentClass = __decorate([
        core_1.Component({
            selector: 'login-component',
            templateUrl: './login.html',
            styles: ['body{ background:red !important; }']
        }), 
        __metadata('design:paramtypes', [login_service_1.loginService, router_1.Router, data_service_1.dataService])
    ], loginContentClass);
    return loginContentClass;
}());
exports.loginContentClass = loginContentClass;
//# sourceMappingURL=login.component.js.map