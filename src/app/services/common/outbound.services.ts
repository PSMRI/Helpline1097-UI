import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OutboundService {
    private subject = new Subject<any>();

    sendOutboundData(data: any) {
        this.subject.next({ outboundData: data });
    }

    clearData() {
        this.subject.next();
    }

    getOutboundData(): Observable<any> {
        return this.subject.asObservable();
    }
}
