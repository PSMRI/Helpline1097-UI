import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { loginService } from '../services/loginService/login.service';
import { AuthService } from '../services/authentication/auth.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
declare let jQuery: any;


@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.css']
})
export class SetSecurityQuestionsComponent implements OnInit {

  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  constructor(
    public getUserData: dataService,
    public http_calls: HttpServices,
    public router: Router,
    private configService: ConfigService,
    private alertService: ConfirmationDialogsService,
    private authService: AuthService,
    private loginService: loginService
  ) {

  }

  handleSuccess(response) {
    this.questions = response;
    this.replica_questions = response;

    this.Q_array_one = response;
    this.Q_array_two = response;
    console.log(this.questions);
  }
  handleError(response) {
    console.log('error', this.questions);
  }

  ngOnInit() {
    this.http_calls.getData(this.configService.getOpenCommonBaseURL() + "user/getsecurityquetions").subscribe(
      (response: any) => this.handleSuccess(response),
      (error: any) => this.handleError(error));

  }

  uid: any = this.getUserData.uid;
  passwordSection: boolean = false;
  questionsection: boolean = true;
  uname: any = this.getUserData.Userdata.userName;

  switch() {
    this.passwordSection = true;
    this.questionsection = false;
  }


  dynamictype: any = "password";

  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }



  question1: any = "";
  question2: any = "";
  question3: any = "";

  answer1: any = '';
  answer2: any = '';
  answer3: any = '';

  questions:Array<any> = [];
  replica_questions:Array<any> = [];
  Q_array_one:Array<any> = [];
  Q_array_two:Array<any> = [];

  selectedQuestions:Array<any> = [];

  updateQuestions(selectedques, position) {
    console.log("position", position, "Selected Question", selectedques);
    console.log("before if else block, selected questions", this.selectedQuestions);

    if (this.selectedQuestions.indexOf(selectedques) == -1) {
      this.selectedQuestions[position] = selectedques;
      if (position === 0) {
        this.answer1 = "";
        // jQuery("#ans1").prop("disabled",false);
      }
      if (position === 1) {
        this.answer2 = "";
        // jQuery("#ans2").prop("disabled",false);
      }
      if (position === 2) {
        this.answer3 = "";
        // jQuery("#ans3").prop("disabled",false);
      }

      console.log("if block, selected questions", this.selectedQuestions);

    }
    else {
      if (this.selectedQuestions.indexOf(selectedques) != position) {
        this.alertService.alert("This question is already selected. Choose unique question");
      }
      else {
        // this.alertService.alert("This question is mapped at this position already");
      }
      console.log("else block, selected questions", this.selectedQuestions);
      console.log("position else block", position);

      // this.disableAnswerField(position);
    }
  }

  filterArrayOne(questionID) {

    /*reset the 2nd and 3rd question and answer fields */
    /* this.question2="";
     this.answer2="";
 
     this.question3="";
     this.answer3="";
 */

    /*filter the primary array based on the selection and feed resultant to Q_array_one*/
    this.Q_array_one = this.filter_function(questionID, this.Q_array_one);
    this.Q_array_two = this.filter_function(questionID, this.Q_array_two);
    // this.questions=this.Q_array_one;
  }

  filterArrayTwo(questionID) {
    /*reset the 3rd question and answer field */
    /*this.question3="";
    this.answer3="";
*/
    /*filter the Q_array_one based on the selection and feed resultant to Q_array_two*/
    this.Q_array_two = this.filter_function(questionID, this.Q_array_two);
    this.questions = this.filter_function(questionID, this.questions);
  }

  filterArrayThree(questionID) {
    this.Q_array_one = this.filter_function(questionID, this.Q_array_one);
    this.questions = this.filter_function(questionID, this.questions);
  }

  filter_function(questionID, array) {
    let dummy_array = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].QuestionID === questionID) {
        continue;
      }
      else {
        dummy_array.push(array[i]);
      }
    }
    return dummy_array;
  }

  dataArray: Array<any> = [];

  setSecurityQuestions() {
    if (this.selectedQuestions.length == 3) {
      this.dataArray = [
        {
          'userID': this.uid,
          'questionID': this.question1,
          'answers': (this.answer1 !=undefined && this.answer1 !=null) ? this.answer1.trim() :null,
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        },
        {
          'userID': this.uid,
          'questionID': this.question2,
          'answers': (this.answer2 !=undefined && this.answer2 !=null) ? this.answer2.trim() :null,
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        },
        {
          'userID': this.uid,
          'questionID': this.question3,
          'answers': (this.answer3 !=undefined && this.answer3 !=null) ? this.answer3.trim() :null,
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        }];

      console.log("Request Array", this.dataArray);
      console.log("selected questions", this.selectedQuestions);

      this.switch();
    }
    else {
      this.alertService.alert("All 3 questions should be different. Please check your selected questions");
    }
  }



  oldpwd: any;
  newpwd: any;
  confirmpwd: any;

  updatePassword(new_pwd) {
    if (new_pwd === this.confirmpwd) {
      this.http_calls.postDataForSecurity(this.configService.getOpenCommonBaseURL() + 'user/saveUserSecurityQuesAns', this.dataArray)
        .subscribe((response: any) => this.handleQuestionSaveSuccess(response, new_pwd),
        (error: any) => this.handleQuestionSaveError(error));

    }
    else {
      this.alertService.alert("Password doesn't match");
    }
  }


  handleQuestionSaveSuccess(response, new_pwd) {
    if(response && response.statusCode == 200 && response.data.transactionId !== undefined && response.data.transactionId !== null) {
    console.log('saved questions', response);
    this.http_calls.postDataForSecurity(this.configService.getOpenCommonBaseURL() + 'user/setForgetPassword',
      { 'userName': this.uname, 'password': new_pwd, 'transactionId': response.data.transactionId })
      .subscribe((response: any) => this.successCallback(response),
      (error: any) => this.errorCallback(error));
    }
    else
    {
      this.alertService.alert(response.errorMessage, 'error');
      
    }

  }
  handleQuestionSaveError(response) {
    console.log('question save error', response);
  }

  successCallback(response) {
    sessionStorage.removeItem('authToken');
    console.log(response);
    this.alertService.alert("Password changed successfully", 'success');
   
    this.router.navigate(['']);
  }

  errorCallback(response) {
    console.log(response);
  }


}
