import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReloadService {
    private subject = new Subject<any>();

    sendReloadCall(data: any) {
        this.subject.next({ compainType: data });
    }

    clearData() {
        this.subject.next();
    }

    getReloadCall(): Observable<any> {
        return this.subject.asObservable();
    }
}
