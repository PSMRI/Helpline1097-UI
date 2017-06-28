import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class dataService
{

	Userdata: any;
	userPriveliges: any;
	uid: any;
	uname: any;
	benData: any;


	beneficiaryData: any = {};
	callData: any = {};

	benRegId: any;
};



