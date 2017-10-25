import { Component } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { Router } from '@angular/router';
import { dataService } from '../services/dataService/data.service';



@Component({
    selector:'ResetComponent',
    templateUrl: './resetPassword.html',
	styles: ['./resetPassword.component.css']
})

export class ResetComponent{
	public response:any;
	public error:any;
	showQuestions: boolean = false;
	hideOnGettingQuestions: boolean = true;
	questionsAnswers: any;
	answer: any=undefined;

	encryptionFlag: boolean = true;
	dynamictype: any = 'password';

	public questions: any[]=[];
	public correctAnswers: any[]=[];
	public userAnswers: any[]=[];

	bufferQuestion: any;
	counter: number = 0;

	constructor(public loginservice: loginService, public getUserData: dataService, public router: Router) { };



	getQuestions(username:any)
	{
		this.getUserData.uname=username;

		this.loginservice.getSecurityQuestions(username).
		subscribe((response:any)=> this.handleSuccess(response),
			 (error:any)=> this.error = <any>error
		);
	}

	handleSuccess(data:any)
    {
		console.log(data);
	 if ((data.SecurityQuesAns) != "user Not Found")
	  {
		  this.questionsAnswers = data.SecurityQuesAns;
		  this.showQuestions = true;
		  this.hideOnGettingQuestions = false;

		  this.getQuestionsandAnswers();

	  }
	}

	toggleAnswerVisibilty()
	{
		console.log('chala toggle');
		this.encryptionFlag = !this.encryptionFlag;
		if(this.encryptionFlag===true)
		{
			this.dynamictype = 'password';
		}
		if(this.encryptionFlag===false){
			this.dynamictype = 'text';

		}
	}

	
	getQuestionsandAnswers() {
		
		console.log('Q n A',this.questionsAnswers);
		for (var i = 0; i < this.questionsAnswers.length;i++)
		{
			this.questions.push(this.questionsAnswers[i].question);
			this.correctAnswers.push(this.questionsAnswers[i].answer);
		}
		console.log('questions',this.questions);
		console.log('answers',this.correctAnswers);
		this.showMyQuestion();
		
	}


	showMyQuestion()
	{
		console.log('this is question' + (this.counter+1));
		this.bufferQuestion = this.questions[this.counter];
	}

	nextQuestion()
	{
		if(this.counter<=3)
		{
			var result=this.saveUserAnswers(this.answer);
			if(result==='correct')
			{
				this.counter = this.counter + 1;
				if (this.counter < 3) {
					this.showMyQuestion();
				}
				else {
					this.router.navigate(['/setPassword']);
				}
			}
			else{
				console.log('incorrect answer, please try again');
			}
		}
	}


	saveUserAnswers(answer: any) {
		this.userAnswers.push(answer);
		console.log(this.userAnswers);
		if(this.userAnswers[this.counter]===this.correctAnswers[this.counter])
		{
			this.answer = undefined;
			return "correct";
		}
		else{
			this.userAnswers.splice(this.counter, 1);
			return "incorrect";
		}
		
	}
}
