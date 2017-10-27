import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'
@Injectable()
export class UpdateService {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  _baseUrl = this._config.getCommonBaseURL();
  _updatebeneficiaryurl = this._baseUrl + 'beneficiary/update/';
  constructor(
    private _http: Http,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  updateBeneficiaryData(values: any) {
    console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._updatebeneficiaryurl, JSON.stringify(values))
      .map(this.extractData).catch(this.handleError);
  }

  private extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  };

  private handleError(error: Response | any) {
    return Observable.throw(error.json());

  };

}
