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

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class CzentrixService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private appState = inject(AppStateService);

  private readonly commonUrl = this.config.getCommonBaseURL();
  private readonly agentStatusUrl = `${this.commonUrl}cti/getAgentState`;
  private readonly callDetailsUrl = `${this.commonUrl}cti/getAgentCallStats`;
  private readonly dialBeneficiaryUrl = `${this.commonUrl}cti/callBeneficiary`;
  private readonly userLogoutUrl = `${this.config.getOpenCommonBaseURL()}user/userLogout`;

  constructor() {}

  /**
   * Get current agent status from telephony server
   */
  getAgentStatus(): Observable<any> {
    const agentId = this.appState.agentID();
    return this.http.post(this.agentStatusUrl, { agent_id: agentId }).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /**
   * Get call statistics for the current agent
   */
  getCallDetails(): Observable<any> {
    const agentId = this.appState.agentID();
    return this.http.post(this.callDetailsUrl, { agent_id: agentId }).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /**
   * Manual dial a number via CTI
   */
  manualDial(phoneNum: string): Observable<any> {
    const agentId = this.appState.agentID();
    const dialObj = { agent_id: agentId, phone_num: phoneNum };
    return this.http.post(this.dialBeneficiaryUrl, dialObj).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /**
   * Core logout logic
   */
  userLogout(): Observable<any> {
    return this.http.post(this.userLogoutUrl, {}).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Czentrix Service Error:', error);
    return throwError(() => error);
  }
}
