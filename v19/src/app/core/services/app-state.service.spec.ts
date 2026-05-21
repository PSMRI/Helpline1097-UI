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

import { TestBed } from '@angular/core/testing';
import { AppStateService } from './app-state.service';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default campaign INBOUND', () => {
    expect(service.currentCampaign()).toBe('INBOUND');
    expect(service.isOutboundSelected()).toBeFalse();
  });

  it('should update campaign and computed values when set to OUTBOUND', () => {
    service.setCampaign('OUTBOUND');
    expect(service.currentCampaign()).toBe('OUTBOUND');
    expect(service.isOutboundSelected()).toBeTrue();
  });

  it('should handle role and service selection correctly', () => {
    const mockRole = { RoleName: 'Agent', RoleID: 1 };
    const mockService = { serviceName: 'General Helpline', serviceID: 1097 };
    
    service.currentRole.set(mockRole);
    service.currentService.set(mockService);
    
    expect(service.roleName()).toBe('Agent');
    expect(service.serviceName()).toBe('General Helpline');
  });

  it('should reset all state values correctly on logout', () => {
    // Set some data
    service.userData.set({ id: 1, name: 'Admin' });
    service.currentRole.set({ RoleName: 'Manager' });
    service.isOnCall.set(true);
    
    // Reset
    service.resetState();
    
    // Verify
    expect(service.userData()).toBeNull();
    expect(service.currentRole()).toBeNull();
    expect(service.isOnCall()).toBeFalse();
  });
});
