import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';

import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
declare let jQuery: any;


@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.css']
})
export class SetSecurityQuestionsComponent implements OnInit {

  constructor(
              public getUserData: dataService,
              public http_calls: HttpServices,
              public router: Router,
              private configService: ConfigService,
              private alertService:ConfirmationDialogsService
              ) {

  }

passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  ngOnInit() {

    this.http_calls.getData(this.configService.getCommonBaseURL() + "user/getsecurityquetions")
    .subscribe(
               (response: any) => this.handleSuccess(response),
               (error: any) => this.handleError(error)
               );

  }

  handleSuccess(response) {
    this.questions = response;
    this.replica_questions=response;

    this.Q_array_one=response;
    this.Q_array_two=response;
    console.log(this.questions);
  }
  
  handleError(response) {
    console.log('error', this.questions);
  }


  uid: any = this.getUserData.uid;
  passwordSection: boolean = false;
  questionsection: boolean = true;
  uname: any = this.getUserData.uname;

  switch() {
    this.passwordSection = true;
    this.questionsection = false;
  }


  dynamictype:any="password";
  
  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD()
  {
    this.dynamictype = 'password';
  }



  question1: any = "";
  question2: any = "";
  question3: any = "";

  answer1: any = '';
  answer2: any = '';
  answer3: any = '';

  questions: any = [];
  replica_questions:any=[];
  Q_array_one:any=[];
  Q_array_two:any=[];

  selectedQuestions: any = [];

  updateQuestions(selectedques,position) {
    console.log("position",position,"Selected Question",selectedques);
    console.log("before if else block, selected questions",this.selectedQuestions);

    if (this.selectedQuestions.indexOf(selectedques) == -1) {
      this.selectedQuestions[position]=selectedques;
      if(position===0)
      {
        this.answer1="";
        // jQuery("#ans1").prop("disabled",false);
      }
      if(position===1)
      {
        this.answer2="";
        // jQuery("#ans2").prop("disabled",false);
      }
      if(position===2)
      {
        this.answer3="";
        // jQuery("#ans3").prop("disabled",false);
      }

      console.log("if block, selected questions",this.selectedQuestions);

    }
    else {
      if(this.selectedQuestions.indexOf(selectedques) != position)
      {
        this.alertService.alert("This Question is already selected. Choose Unique Question");
      }
      else
      {
        // this.alertService.alert("This question is mapped at this position already");
      }
      console.log("else block, selected questions",this.selectedQuestions);
      console.log("position else block",position);
      
      // this.disableAnswerField(position);
    }
  }

  filterArrayOne(questionID)
  {

    /*reset the 2nd and 3rd question and answer fields */
   /* this.question2="";
    this.answer2="";

    this.question3="";
    this.answer3="";
    */

    /*filter the primary array based on the selection and feed resultant to Q_array_one*/
    this.Q_array_one=this.filter_function(questionID,this.Q_array_one);
    this.Q_array_two=this.filter_function(questionID,this.Q_array_two);
    // this.questions=this.Q_array_one;
  }

  filterArrayTwo(questionID)
  {
    /*reset the 3rd question and answer field */
    /*this.question3="";
    this.answer3="";
    */
    /*filter the Q_array_one based on the selection and feed resultant to Q_array_two*/
    this.Q_array_two=this.filter_function(questionID,this.Q_array_two);
    this.questions=this.filter_function(questionID,this.questions);
  }

  filterArrayThree(questionID)
  {
    this.Q_array_one=this.filter_function(questionID,this.Q_array_one);
    this.questions=this.filter_function(questionID,this.questions);
  }

  filter_function(questionID,array)
  {
    let dummy_array=[];
    for(let i=0;i<array.length;i++)
    {
      if(array[i].QuestionID===questionID){
       continue;
     }
     else{
      dummy_array.push(array[i]);
    }
  }
  return dummy_array;
}

dataArray: any = [];

setSecurityQuestions() {
  if (this.selectedQuestions.length == 3) 
  {
    this.dataArray = [
    {
      'userID': this.uid,
      'questionID': this.question1,
      'answers': this.answer1,
      'mobileNumber': '1234567890',
      'createdBy': this.uname
    },
    {
      'userID': this.uid,
      'questionID': this.question2,
      'answers': this.answer2,
      'mobileNumber': '1234567890',
      'createdBy': this.uname
    },
    {
      'userID': this.uid,
      'questionID': this.question3,
      'answers': this.answer3,
      'mobileNumber': '1234567890',
      'createdBy': this.uname
    }];

    console.log("Request Array",this.dataArray);
    console.log("selected questions",this.selectedQuestions);                                                                                                                         

    this.switch();
  } 
  else 
  {
    this.alertService.alert("All 3 questions should be different. Please check your selected Questions");
  }
}



oldpwd: any;
newpwd: any;
confirmpwd: any;

updatePassword(new_pwd) {
  if (new_pwd === this.confirmpwd) {
    this.http_calls.postData(this.configService.getCommonBaseURL() + 'user/saveUserSecurityQuesAns', this.dataArray)
    .subscribe((response: any) => this.handleQuestionSaveSuccess(response,new_pwd),
               (error: any) => this.handleQuestionSaveError(error));

  }
  else {
    this.alertService.alert("Password doesn't match");
  }
}


handleQuestionSaveSuccess(response,new_pwd) {
  console.log('saved questions', response);
  this.http_calls.postData(this.configService.getCommonBaseURL() + 'user/setForgetPassword',
                           { 'userName': this.uname, 'password': new_pwd })
  .subscribe((response: any) => this.successCallback(response),
             (error: any) => this.errorCallback(error));

}
handleQuestionSaveError(response) {
  console.log('question save error', response);
}

successCallback(response) {

  console.log(response);
  this.alertService.alert("Password changed Successfully");
  this.router.navigate(['']);
}
errorCallback(response) {
  console.log(response);
}

}
