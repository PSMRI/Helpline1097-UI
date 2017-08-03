/*
** Service Used to call the Api which upload a document
** Created by Pankush Manchanda 31 July ,2017
*/

import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class UploadServiceService {

  public headers = new Headers({ 'Content-Type': 'application/json' });
  public options = new RequestOptions({ headers: this.headers });
  public baseUrl = this._config.getCommonBaseURL();
  public uploadDocumentUrl = this.baseUrl + '/kmfilemanager/addFile';
  constructor(private _http: Http,
    private _config: ConfigService) { }

  public uploadDocument(uploadObj: any) {
    return this._http.post(this.uploadDocumentUrl, JSON.stringify(uploadObj), this.options).map(this.extractData).catch(this.handleError)
  }
  private extractData(response: Response) {

    if (response.json().data) {
      return response.json().data;
    } else {
      console.log('Status', response.json().status);
      return response.json().status;

    }
  };

  private handleError(res: Response) {
    return res.json();
  };
}
