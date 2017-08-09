import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';

@Injectable()
export class OutboundCallAllocationService{

    test=[];
    _baseurl: String = this._config.getCommonBaseURL();
    headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );

     options = new RequestOptions({ headers: this.headers });
     private _geturl: string = "http://10.152.3.152:1040/AdminAPI1.0/user/iEMR/User/getData";
     private _allocateurl: string = this._baseurl+"call/outboundAllocation";;

      constructor(private _http:Http, private _config: ConfigService){}

    getAgents(){
            
            return this._http.post(this._geturl,this.options)
            .map((response:Response)=> response.json());
            
        }
        
    allocateCallsToAgenta(data:any){
        console.log("inside the call config services");
        console.log(data);
        return this._http.post(this._allocateurl,data,this.options)
        .map((response:Response)=> response.json());
        
    }
}