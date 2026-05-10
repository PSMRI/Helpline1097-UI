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

import { Injectable, signal, computed } from '@angular/core';

/**
 * Service to manage global application state using Angular Signals.
 * Replaces the legacy data.service.ts.
 * 
 * @author Rohan Saini
 */
@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // User & Session State
  readonly userData = signal<any>(null);
  readonly userPrivileges = signal<any>(null);
  readonly agentID = signal<string | undefined>(undefined);
  readonly loginIP = signal<string | null>(null);
  readonly loginKey = signal<string | null>(null);

  // Role & Service Selection
  readonly currentRole = signal<any>(null);
  readonly currentService = signal<any>(null);
  readonly currentServiceID = signal<any>(null);
  readonly serviceProviderID = signal<any>(null);

  // Call & Campaign State
  readonly currentCampaign = signal<string>('INBOUND');
  readonly isOutboundSelected = signal<boolean>(false);
  readonly onlyOutboundAvailable = signal<boolean>(false);
  readonly isOnCall = signal<boolean>(false);
  readonly callerNumber = signal<string | null>(null);
  readonly callID = signal<string | null>(null);
  
  // Beneficiary State
  readonly beneficiaryData = signal<any>({});
  readonly benRegId = signal<any>(null);

  // Computed states for easy UI access
  readonly roleName = computed(() => this.currentRole()?.RoleName || '');
  readonly serviceName = computed(() => this.currentService()?.serviceName || '');

  constructor() {}

  /**
   * Reset the entire state (useful on logout)
   */
  resetState() {
    this.userData.set(null);
    this.userPrivileges.set(null);
    this.currentRole.set(null);
    this.currentService.set(null);
    this.isOnCall.set(false);
    this.callerNumber.set(null);
  }

  /**
   * Update campaign status
   */
  setCampaign(campaign: 'INBOUND' | 'OUTBOUND') {
    this.currentCampaign.set(campaign);
    this.isOutboundSelected.set(campaign === 'OUTBOUND');
  }
}
