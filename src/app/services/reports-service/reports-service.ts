import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class ReportsService {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  private getAllBySexualOrientationURL = this._config.getCommonBaseURL() + "crmReports/getAllBySexualOrientation";
  private getAllByGenderURL = this._config.getCommonBaseURL() + "crmReports/getAllByGender";
  private getAllByAgeGroupURL = this._config.getCommonBaseURL() + "crmReports/getAllByAgeGroup";
  private getAllReportsByDateURL = this._config.getCommonBaseURL() + "crmReports/getAllReportsByDate";

  constructor(
    private _http: Http,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp
  ) { }

  getAllBySexualOrientation(data){
      return this._http.post(this.getAllBySexualOrientationURL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllByGender(data){
      return this._http.post(this.getAllByGenderURL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllByAgeGroup(data){
      return this._http.post(this.getAllByAgeGroupURL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllReportsByDate(data){
      return this._http.post(this.getAllReportsByDateURL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

   private extractData(res: Response) {
      if (res.json().data) {
        return res.json().data;
      } else {
        return res.json();
      }
    };

    private customhandleError(error: Response | any) {
      return Observable.throw(error.json());

    };
    private handleError(res: Response) {
      return res.json();
    };

}