import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
/**
 * Author: Neeraj Kumar ( 298657 )
 * Date: 19-05-2017
 * Objective: Class UserService will be used for Http Services.
 */ 
    export class DashboardHttpServices{
        // Constructor for initialize the Http object...
        constructor(private  http: Http){}
        // Function to call get API, Returns response in Json format...
        getData(url: string) {
            return this.http.get(url).map((res:Response) => res.json());
        }
        // Function to call post API, Returns response in Json format...
        postData(){

        }
    }

