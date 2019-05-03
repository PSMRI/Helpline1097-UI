import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';


/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 29-05-2017
 * Objective: A common service for all HTTP services, just pass the URL and required DATA
 */

@Injectable()
export class HttpServices {

  constructor(private http: Http,private interceptor: InterceptedHttp) { };

  // tslint:disable-next-line:indent
  getData(url: string) {
    return this.interceptor.get(url)
      .map(this.handleGetSuccess)
      .catch(this.handleGetError);
  }
	getLanguage(url:string)
	{
		return this.http.get(url)
				.map(this.handleGetSuccess)
				.catch(this.handleGetError);
	}
  	getCommitDetails(url: string) {
		return this.http.get(url)
			.map(this.handleGetSuccess)
			.catch(this.handleGetError);
	}
  handleGetSuccess(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  }

  handleGetError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  postData(url: string, data: any) {
    return this.http.post(url, data)
      .map(this.handleGetSuccess)
      .catch(this.handleGetError);
  }


};



