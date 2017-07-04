import {Injectable} from '@angular/core';
import {Http, Response,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class FeedbackService{
    test=[];
     headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
    );
     options = new RequestOptions({ headers: this.headers });
     private _geturl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/getFeedback"
     private _updateurl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedback"
   //  private _updateurl:string="http://localhost:8080/Helpline-104-API/grievance/updateFeedback"
     private _statusurl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedbackStatus"
     private _searchurl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/searchFeedback1"
     private _responurl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/responceFeedback"
     private _responceurl:string="http://10.152.3.152:1040/Helpline-104-API/grievance/getAllFeedbackById1"
    
    constructor(private _http:Http){}
    getFeedback(){
        
        return this._http.post(this._geturl,this.options)
        .map((response:Response)=> response.json());
        
    }
    updateFeedback(data:any){

        //console.log(data);
        return this._http.post(this._updateurl,data ,this.options)
        
        .map((response:Response)=> response.json());
        
    }
    updateStatus(sdata:any){
        return this._http.post(this._statusurl,sdata ,this.options)
        .map((response:Response)=> response.json());
    }
    searchFeedback(searchdata:any){

        return this._http.post(this._searchurl,searchdata ,this.options)
        .map((response:Response)=> response.json());

    }
    responceStatus(resData:any){
        return this._http.post(this._responurl,resData ,this.options)
        .map((response:Response)=> response.json());

    }


    responce(responce:any){
        return this._http.post(this._responceurl,responce,this.options)
        .map((response:Response)=> response.json());

    }
}