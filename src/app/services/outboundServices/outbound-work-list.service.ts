import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class OutboundWorklistService {

    test = [];
    _baseurl: String = this._config.getCommonBaseURL();
    // _104BaseUrl: String = this._config.get104BaseURL();
    _104BaseUrl: String = 'http://localhost:8080/';
    private _callList: string = this._baseurl + 'call/outboundCallList';
    private _saveBloodBankDetailsUrl: string = this._104BaseUrl + 'beneficiary/save/bloodBankDetails';
    private _updateBloodBankDetailsUrl: string = this._104BaseUrl + 'beneficiary/update/bloodBankDetails';
    constructor(private _http: Http, private _config: ConfigService) { }

    getCallWorklist(val: any) {

        return this._http.post(this._callList, val)
            .map(this.extractData).catch(this.handleError);
    }

    saveBloodBankDetails(data) {
        return this._http.post(this._saveBloodBankDetailsUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    updateBloodBankDetails(data) {
        return this._http.post(this._updateBloodBankDetailsUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.json().data) {
            return res.json().data;
        } else {
            return Observable.throw(res.json());
        }
    };

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };


}
