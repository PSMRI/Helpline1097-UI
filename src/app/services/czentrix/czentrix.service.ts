import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";


@Injectable()
export class CzentrixServices {
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    address = this._config.getTelephonyServerURL();
    path = 'apps/appsHandler.php?';
    _getTodaysCallReport = this.address + 'apps/cust_appsHandler.php?transaction_id=CTI_AGENT_CALL_RECORD&agent_id=201&resFormat=3'
    resFormat = 3;
    transaction_id: any;
    agent_id: any;
    ip: any;
    phone_num: number;
    constructor(private http: Http, private _config: ConfigService) { }



    agentLogin(agentId, ipAddress) {
        this.transaction_id = "CTI_LOGIN";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    agentLogout(agentId, ipAddress) {
        this.transaction_id = "CTI_LOGOUT";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    getOnlineAgents(agentId, ipAddress) {
        this.transaction_id = "CTI_ONLINE_AGENTS";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    manualDialaNumber(agentId, ipAddress, phoneNum) {
        this.transaction_id = "CTI_DIAL";
        this.agent_id = agentId;
        this.ip = ipAddress;
        this.phone_num = phoneNum;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&phone_num=" + this.phone_num + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    transferCall(transferFromAgentId, transferToAgentId, ipAddress) {

        this.transaction_id = "CTI_TRANSFER_AGENT";
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&transfer_ from=" + transferFromAgentId + "&transfer_to=" + transferToAgentId + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    getAgentPhoneNumber(agentId) {
        this.transaction_id = "CTI_GETNUMBER";
        this.agent_id = agentId;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    switchToReadyMode(agentId, ipAddress) {
        this.transaction_id = "CTI_READY";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    switchBreakFree(agentId, ipAddress, state) { //state : BREAK / FREE
        this.transaction_id = "CTI_PAUSE";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&state=" + state + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    disconnectCall(agentId, ipAddress) {
        this.transaction_id = "CTI_DISCONNECT";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    callHoldUnhold(agentId, ipAddress, state) { //state : HOLD / UNHOLD
        this.transaction_id = "CTI_HOLD";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&state=" + state + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    checkAgentStatus(agentId, ipAddress) {
        this.transaction_id = "CTI_CHECK_AGENT_STATE";
        this.agent_id = agentId;
        this.ip = ipAddress;

        let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        return this.callAPI(params);
    }

    blockNumber() {

    }

    getIpAddress(agentId) {
        this.transaction_id = "CTI_GET_AGENTIP";
        this.agent_id = agentId;
        let params = "apps/cust_appsHandler.php?transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + "&resFormat=" + this.resFormat;

        return this.http.get(this.address + params).map((res: Response) => this.extractData(res));
    }

    callAPI(params) {
        return this.http.get(this.address + this.path + params).map((res: Response) => this.extractData(res));
    }

    getTodayCallReports() {        
        return this.http.get(this._getTodaysCallReport).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        // console.log("inside extractData:"+JSON.stringify(res.json()));
        // let body = res.json();
        //return body.data || {};
        return res.json();
    };

    private handleError(error: Response | any) {        
        // In a real world app, you might use a remote logging infrastructure
        // let errMsg: string;
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }
        // console.error(errMsg);
        return Observable.throw(error.json());
    };


}

