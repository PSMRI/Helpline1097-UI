import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import { AuthorizationWrapper } from './../../authorization.wrapper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class coCategoryService {

    test = [];
    _baseurl = this._config.getCommonBaseURL();
    _categoryurl = this._baseurl + "";
    _subcategoryurl = this._baseurl + "";
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService
    ) { }
    getCategories() {
        let obj = {};
        return this._http.post(this._categoryurl, obj)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSubCategories(data: any) {
        return this._http.post(this._subcategoryurl, data)
            .map(this.extractData)
            .catch(this.handleError);

    }



    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    handleError(response: Response) {
        return Observable.throw(response.json());
    }
};



