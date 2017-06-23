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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var UtilityService = (function () {
    function UtilityService(_http) {
        this._http = _http;
    }
    UtilityService.prototype.storeCallType = function (values) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Basic somethingsomethinghidden');
        headers.append('X-SyncTimeout', '30');
        headers.append('Accept', 'application/json');
        headers.append('Cache-Control', 'no-cache');
        headers.append('Content-Type', 'application/json');
        headers.append('withCredentials', 'true');
        var url = "http://localhost:9000/iemr/common/addCallType";
        var createData = '{"callType":"' + values.calltype + '","remarks":"' + values.callRemarks + '","invalidType":"' + values.invalidCallType + '"}';
        var body = JSON.stringify(createData);
        return this._http.post(url, createData, { headers: headers }).map(function (response) {
            response.text();
            console.log(response.text());
        });
    };
    UtilityService.prototype.getCallTypes = function () {
        var url = "http://localhost:9000/iemr/common/getAllCallTypes";
        return this._http.get(url).map(function (response) {
            return response.json();
        });
    };
    return UtilityService;
}());
UtilityService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UtilityService);
exports.UtilityService = UtilityService;
//# sourceMappingURL=utility.service.js.map