import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OutboundSearchRecordService{

    test=[];
    data:any;
    _baseurl: String = this._config.getCommonBaseURL();
    headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );

    constructor(private _http:Http, private _config: ConfigService){
       
        
      }

     options = new RequestOptions({ headers: this.headers });
     //private _geturl: string = this._baseurl+"/agentcallallocationcontroller/get/unallocatedcalls";
     private _geturl: string = this._baseurl+"call/outboundCallList";
     private _allocateurl: string = this._baseurl+"";

    getUnallocatedCalls(val:any){

            console.log("data in servise",this.data);
            return  this._http.post(this._geturl, val, this.options)
            .map(this.extractData);    
        }

    getSubRecords(data:any, key:any, val: any){

        return data.json().filter(data => data.key == val);
    }

    getOutbondCount(val:any){

        return this._http.post(this._geturl,val,this.options)
            .map((response:Response)=> response.json()); 
    };

    private extractData ( res: Response ){

        console.log("service log: ",res);
        if ( res.json().data )
        {
            return res.json();
        } else
        {
            return res.json();
        }
    };
        
}