                                                                                                                                 import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { ConfigService } from "../config/config.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OutboundWorklistService{

    test=[];
    _baseurl: String = this._config.getCommonBaseURL();
   // _104BaseUrl: String = this._config.get104BaseURL();
    _104BaseUrl: String = "http://localhost:8080/";
    headers = new Headers(
     //{'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );

    options = new RequestOptions({ headers: this.headers });
    private _callList: string = this._baseurl+"call/outboundCallList";
    private _saveBloodBankDetailsUrl: string = this._104BaseUrl+"beneficiary/save/bloodBankDetails";
    private _updateBloodBankDetailsUrl: string = this._104BaseUrl+"beneficiary/update/bloodBankDetails";
    constructor(private _http:Http,  private _config: ConfigService){}

    getCallWorklist(val:any){
            
        return this._http.post(this._callList,val,this.options)
        .map( this.extractData ).catch( this.handleError );
    }

    saveBloodBankDetails(data){
        return this._http.post(this._saveBloodBankDetailsUrl, data, this.options)
        .map( this.extractData ).catch( this.handleError );
    }
    
    updateBloodBankDetails(data){
        return this._http.post(this._updateBloodBankDetailsUrl, data, this.options)
        .map( this.extractData ).catch( this.handleError );
    }

    private extractData(res: Response) {
	   // console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		if (res.json().data) {
			
			return res.json().data;
		} else {
		
			return res.json();
		}
	};

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
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
	};


}
