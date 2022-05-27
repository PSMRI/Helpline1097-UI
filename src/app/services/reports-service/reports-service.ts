import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ReportsService {
  private getAllBySexualOrientationURL = this._config.getCommonBaseURL() + "crmReports/getAllBySexualOrientation";
  private getAllByGenderURL = this._config.getCommonBaseURL() + "crmReports/getAllByGender";
  private getAllByAgeGroupURL = this._config.getCommonBaseURL() + "crmReports/getAllByAgeGroup";
  private getAllReportsByDateURL = this._config.getCommonBaseURL() + "crmReports/getAllReportsByDate";
  private getCountsByPreferredLanguageURL = this._config.getCommonBaseURL() + "crmReports/getCountsByPreferredLanguage";
 
  headers = new Headers(
    {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': this.authService.getToken()
  }
   );
  options = new RequestOptions({ headers: this.headers , responseType: ResponseContentType.Blob });
  constructor(
    private _http: Http,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp,
    private authService: AuthService
  ) { }

  getAllBySexualOrientation(data) {
    return this._http
    .post(this.getAllBySexualOrientationURL, data, this.options)
    .map(res => <Blob>res.blob());
    // return this.httpInterceptor.post(this.getAllBySexualOrientationURL, data)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }

  getAllByGender(data) {
    return this._http
    .post(this.getAllByGenderURL, data, this.options)
    .map(res => <Blob>res.blob());
    // return this.httpInterceptor.post(this.getAllByGenderURL, data)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }

  getAllByAgeGroup(data) {
    return this._http
    .post(this.getAllByAgeGroupURL, data, this.options)
    .map(res => <Blob>res.blob());

    // return this.httpInterceptor.post(this.getAllByAgeGroupURL, data)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }

  getAllReportsByDate(data) {
    return this._http
    .post(this.getAllReportsByDateURL, data, this.options)
    .map(res => <Blob>res.blob());

    // return this.httpInterceptor.post(this.getAllReportsByDateURL, data)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }

  getCountsByPreferredLanguage(data) {
    return this._http
    .post(this.getCountsByPreferredLanguageURL, data, this.options)
    .map(res => <Blob>res.blob());
    // return this.httpInterceptor.post(this.getCountsByPreferredLanguageURL, data)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  };

  private customhandleError(error: Response | any) {
    return Observable.throw(error.json());

  };
  private handleError(error: Response) {
    return Observable.throw(error.json());
  };

}