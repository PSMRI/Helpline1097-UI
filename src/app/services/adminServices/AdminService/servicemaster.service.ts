import { Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ServicemasterService {

  test=[];
     headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
    );
     options = new RequestOptions({ headers: this.headers });
     private _geturl:string="http://localhost:8080/iEMR/ServiceMaster/getServiceData"
     private _saveurl:string="http://localhost:8080/iEMR/ServiceMaster/saveService"
    
    constructor(private _http:Http){}
    getServiceMaster(){
        
        return this._http.post(this._geturl,this.options)
        .map((response:Response)=> response.json());
        
    }
    saveServiceMaster(data:any){

        //console.log(data);
        return this._http.post(this._saveurl,data ,this.options)
        
        .map((response:Response)=> response.json());
        
    }

}
