import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'

@Injectable()
export class CallServices {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  _baseUrl = this._config.get1097BaseURL();
  _commonURL = this._config.getCommonBaseURL();
  _closecallurl = this._commonURL + 'call/closeCall/';
  _callsummaryurl = this._baseUrl + 'services/getCallSummary/';
  _calltypesurl = this._commonURL + 'call/getCallTypes/';
  constructor(
    private _http: Http,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  closeCall(values: any) {
    console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._closecallurl, values).map(this.extractData).catch(this.handleError);
  }

  getCallSummary(values: any) {
    console.log('Call summary to be retreived for ', values)
    return this._http.post(this._callsummaryurl, values, this.options).map(this.extractData).catch(this.handleError);
  }
  getCallTypes(values: any) {
    console.log('call types to be retreived for ', values)
    return this._http.post(this._calltypesurl, values, this.options).map(this.extractData).catch(this.handleError);
  }

  extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  }

  handleError(response: Response) {
    return response.json()
  }

}
