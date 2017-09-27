import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ListnerService {
    private subject = new Subject<any>();

    cZentrixSendData(data: any) {
        this.subject.next({ eventCzentrix: data });
    }

    clearData() {
        this.subject.next();
    }

    cZentrixGetData(): Observable<any> {
        return this.subject.asObservable();
    }
}
