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
var router_1 = require('@angular/router');
var ResetComponent = (function () {
    function ResetComponent(loginservice, router) {
        this.loginservice = loginservice;
        this.router = router;
        this.showQuestions = false;
        this.hideOnGettingQuestions = true;
        this.answer = undefined;
        this.encryptionFlag = true;
        this.dynamictype = 'password';
        this.questions = [];
        this.correctAnswers = [];
        this.userAnswers = [];
        this.counter = 0;
    }
    ;
    ResetComponent.prototype.getQuestions = function (username) {
        var _this = this;
        this.loginservice.getSecurityQuestions(username).
            subscribe(function (response) { return _this.handleSuccess(response); }, function (error) { return _this.error = error; });
    };
    ResetComponent.prototype.handleSuccess = function (data) {
        console.log(data);
        if ((data) != "user Not Found") {
            this.questionsAndAnswers = data;
            this.showQuestions = true;
            this.hideOnGettingQuestions = false;
            //delete this part post feeding correct api
            this.questionsAndAnswers = {
                "one": ["question 1", "Answer 1"],
                "two": ["question 2", "Answer 2"],
                "three": ["question 3", "Answer 3"],
                "four": ["question 4", "Answer 4"]
            };
            this.getQuestionsandAnswers();
        }
    };
    ResetComponent.prototype.toggleAnswerVisibilty = function () {
        console.log('chala toggle');
        this.encryptionFlag = !this.encryptionFlag;
        if (this.encryptionFlag === true) {
            this.dynamictype = 'password';
        }
        if (this.encryptionFlag === false) {
            this.dynamictype = 'text';
        }
    };
    ResetComponent.prototype.getQuestionsandAnswers = function () {
        for (var key in this.questionsAndAnswers) {
            if (this.questionsAndAnswers.hasOwnProperty(key)) {
                var val = this.questionsAndAnswers[key];
                // console.log(val[0]);
                // console.log("array" + this.questions);
                this.questions.push(val[0]);
                // console.log(val[1]);
                this.correctAnswers.push(val[1]);
            }
        }
        this.showMyQuestion();
    };
    ResetComponent.prototype.showMyQuestion = function () {
        console.log('this is question' + (this.counter + 1));
        this.bufferQuestion = this.questions[this.counter];
    };
    ResetComponent.prototype.nextQuestion = function () {
        if (this.counter <= 3) {
            this.saveUserAnswers(this.answer);
            this.counter = this.counter + 1;
            if (this.counter < 4) {
                this.showMyQuestion();
            }
            else {
                // alert('will display result shortly');
            }
        }
    };
    ResetComponent.prototype.saveUserAnswers = function (answer) {
        this.userAnswers.push(answer);
        console.log(this.userAnswers);
        this.answer = undefined;
    };
    ResetComponent = __decorate([
        core_1.Component({
            selector: 'ResetComponent',
            templateUrl: './resetPassword.html',
            styles: ['body{ background:red !important; }']
        }), 
        __metadata('design:paramtypes', [login_service_1.loginService, router_1.Router])
    ], ResetComponent);
    return ResetComponent;
}());
exports.ResetComponent = ResetComponent;
//# sourceMappingURL=resetPassword.component.js.map