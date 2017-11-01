import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClearFormService {
    private subject = new Subject<any>();

    clearFormSender(data: any) {
        this.subject.next({ dataPass: data });
    }

    clearData() {
        this.subject.next();
    }

    clearFormGetter(): Observable<any> {
        return this.subject.asObservable();
    }
}
