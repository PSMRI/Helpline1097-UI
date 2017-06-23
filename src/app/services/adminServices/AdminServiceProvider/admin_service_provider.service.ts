import {Injectable} from '@angular/core';
import {Http, Response,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SPService{
    test=[];
     headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );
     options = new RequestOptions({ headers: this.headers });
     private _geturl: string = "http://10.152.3.152:1040/adminAPI/getprovider";
    //  private _geturl: string = "http://localhost:8080/adminAPI/getprovider";
     private _saveurl: string = "http://10.152.3.152:1040/adminAPI/saveprovider";
     private _deleteurl:string="http://localhost:8080/adminAPI/Delete"
     private _updateurl:string="http://localhost:8080/adminAPI/UpdateServiceProvider"
    //private _url:string="http://10.152.3.152:1040/Admin1.1/iEMR/Admin/userAuthenticate/test/sinu"
     //private _url:string="./app/providerdata.json"
    constructor(private _http:Http){}
    getProviders(){
        
        return this._http.post(this._geturl,this.options)
        .map((response:Response)=> response.json());
        
    }
    saveProviders(data:any){

        //console.log(data);
        return this._http.post(this._saveurl,data ,this.options)
        
        .map((response:Response)=> response.json());
        
    }
    
    deleteProviders(request:any){
        return this._http.post(this._deleteurl,request ,this.options)
        .map((response:Response)=> response.json());
    }

    updateProviders(req:any){
        return this._http.post(this._deleteurl,req ,this.options)
        .map((response:Response)=> response.json());
    }
}