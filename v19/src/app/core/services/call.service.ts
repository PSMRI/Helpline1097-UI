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

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly commonUrl = this.config.getCommonBaseURL();
  private readonly closeCallUrl = `${this.commonUrl}call/closeCall`;
  private readonly disconnectCallUrl = `${this.commonUrl}cti/disconnectCall`;
  private readonly switchToInboundUrl = `${this.commonUrl}cti/switchToInbound`;
  private readonly switchToOutboundUrl = `${this.commonUrl}cti/switchToOutbound`;
  private readonly getCampaignNamesUrl = `${this.commonUrl}cti/getCampaignNames`;

  constructor() {}

  /**
   * Close a completed call with disposition details
   */
  closeCall(values: any): Observable<any> {
    return this.http.post(this.closeCallUrl, values).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Hard disconnect a call for an agent
   */
  disconnectCall(agentID: any): Observable<any> {
    return this.http.post(this.disconnectCallUrl, { agent_id: agentID }).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Switch the agent's CTI campaign to Inbound
   */
  switchToInbound(agentID: any): Observable<any> {
    return this.http.post(this.switchToInboundUrl, { agent_id: agentID }).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Switch the agent's CTI campaign to Outbound
   */
  switchToOutbound(agentID: any): Observable<any> {
    return this.http.post(this.switchToOutboundUrl, { agent_id: agentID }).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get available campaign names for the service
   */
  getCampaignNames(serviceNameObj: any): Observable<any> {
    return this.http.post(this.getCampaignNamesUrl, serviceNameObj).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Call Service Error:', error);
    return throwError(() => error);
  }
}
