import { Injectable } from '@angular/core';

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

	current_role: any;
	current_service: any;
	parentBeneficiaryData: any = {};
	cZentrixAgentID: number;
	loginIP: any;
	loginKey: any;
	outBoundCallID: any;
	isCallDisconnected: boolean = false;


	serviceProviderID: any;
	isOutbound: boolean = false;
};



