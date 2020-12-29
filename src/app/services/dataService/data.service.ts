import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class dataService {

	Userdata: any;
	userPriveliges: any;
	uid: any;
	uname: any;
	benData: any;

	callerNumber: any;
	callID: any;
	beneficiaryData: any = {};
	callData: any = {};
	current_campaign: any;

	benRegId: any;
	roleSelected = new Subject();
	current_role: any;
	current_service: any;
	current_serviceID:any;
	
	parentBeneficiaryData: any = {};
	cZentrixAgentID: number;
	loginIP: any;
	loginKey: any;
	outBoundCallID: any;
	isCallDisconnected: boolean = false;


	serviceProviderID: any;
	isOutbound: boolean = false;
	current_workingLocationID: any;
	sendHeaderStatus = new Subject();
	currentCampaignName: any;
	outboundBenRegID : any;
    inOutCampaign = new Subject();
	beneficiarySelected = new Subject();
	everwellBeneficiarySelected = new Subject();

	beneficiaryRegID: any;
	outboundData: any;
	outboundEverwellData: any;
	feedbackData=[];
	// beneficiaryID: any;
	// myBool$: Observable<boolean>;

	//   reset_flag:boolean;

	//   constructor() {
	//       this.reset_flag = false;
	//       this.myBool$ = this.reset_flag.asObservable();
	//   }
    everwellCallNotConnected:any = "No";
	beneficiary_regID_subject=new Subject();
	checkEverwellResponse :boolean = false;
	previousFeedback:any;
};



