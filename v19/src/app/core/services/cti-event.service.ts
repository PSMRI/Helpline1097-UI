/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Service to handle event distribution for CTI (Telephony) events.
 * Replaces the legacy ListnerService.
 * 
 * @author Rohan Saini
 */
@Injectable({
  providedIn: 'root'
})
export class CtiEventService {
  private ctiEventSubject = new Subject<any>();

  /**
   * Broadcast a new CTI data event (e.g. from the Czentrix iframe)
   */
  sendCtiData(data: any) {
    this.ctiEventSubject.next({ eventCzentrix: data });
  }

  /**
   * Clear the current event data
   */
  clearData() {
    this.ctiEventSubject.next(null);
  }

  /**
   * Returns an observable to listen for CTI events
   */
  getCtiData(): Observable<any> {
    return this.ctiEventSubject.asObservable();
  }
}
