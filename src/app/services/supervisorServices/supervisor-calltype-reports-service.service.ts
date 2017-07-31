import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";

@Injectable()
export class SupervisorCallTypeReportService {

  commonBaseURL:any;
  filterCallList_URL: any;
  getCallTypes_URL: any;

  constructor(private _http: Http,private _config: ConfigService) {
    this.commonBaseURL = this._config.getCommonBaseURL();
    this.filterCallList_URL = this.commonBaseURL + "call/filterCallList";
    this.getCallTypes_URL = this.commonBaseURL + "call/getCallTypes";
  }

  filterCallList(requestObject)
  {
    return this._http.post(this.filterCallList_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  getCallTypes(requestObject) {
    return this._http.post(this.getCallTypes_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  handleSuccess(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  }

  handleError(response: Response) {
    return response.json();
  }
}