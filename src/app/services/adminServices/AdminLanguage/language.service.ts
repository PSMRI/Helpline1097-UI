import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpServices } from "../../http-services/http_services.service";
import 'rxjs/add/operator/map';

@Injectable()
export class LanguageService {

    test = [];
    headers = new Headers(
        { 'Content-Type': 'application/json' }
        //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
        //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
        //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
        //  ,{'Access-Control-Allow-Methods': '*'}
    );
    options = new RequestOptions({ headers: this.headers });
    private _geturl: string = "http://localhost:8080/Language/iEMR/userLanguage/getData"
    private _saveurl: string = "http://localhost:8080//iEMR/userLanguage/saveUserLanguage"

    constructor(private _http: Http) { }
    getLanguage() {

        return this._http.post(this._geturl, this.options).map(this.extractData).catch(this.handleError);
        //.map(( response: Response ) => response.json() );

    }
    saveLanguage(data: any) {

        //console.log(data);
        return this._http.post(this._saveurl, data, this.options).map(this.extractData).catch(this.handleError);

        // .map(( response: Response ) => response.json() );

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
