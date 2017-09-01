import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommunicationService {
    private subject = new Subject<any>();

    sendData(data: any) {
        this.subject.next({ dataPass: data });
    }

    clearData() {
        this.subject.next();
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }
}
