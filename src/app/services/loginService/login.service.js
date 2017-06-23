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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var loginService = (function () {
    function loginService(http) {
        this.http = http;
        this.authenticateUser = function (uname, pwd) {
            return this.http.get('http://10.152.3.152:1040/Admin1.1/iEMR/Admin/userAuthenticate/' + uname + '/' + pwd)
                .map(this.extractData)
                .catch(this.handleError);
        };
    }
    ;
    loginService.prototype.getSecurityQuestions = function (uname) {
        return this.http.get('http://10.152.3.152:1040/Admin1.1/iEMR/Admin/forgetPassword/' + uname)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ;
    loginService.prototype.extractData = function (res) {
        // console.log("inside extractData:"+JSON.stringify(res.json()));
        // let body = res.json();
        //return body.data || {};
        return res.json();
    };
    ;
    loginService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    ;
    loginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], loginService);
    return loginService;
}());
exports.loginService = loginService;
;
//# sourceMappingURL=login.service.js.map