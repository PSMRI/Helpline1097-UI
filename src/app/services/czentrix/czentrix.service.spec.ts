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

/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { CzentrixServices } from './czentrix.service';
import { ConfigService } from '../config/config.service';
import { dataService } from '../dataService/data.service';
import { AuthorizationWrapper } from '../../authorization.wrapper';
import { InterceptedHttp } from '../../http.interceptor';
import { sessionStorageService } from '../sessionStorageService/session-storage.service';

describe('CzentrixServices', () => {
  let service: CzentrixServices;
  let mockAuthWrapper: any;
  let mockHttp: any;
  let mockHttpInterceptor: any;
  let mockConfig: any;
  let mockData: any;
  let mockSessionStorage: any;

  beforeEach(() => {
    mockAuthWrapper = jasmine.createSpyObj('AuthorizationWrapper', ['post', 'get']);
    mockHttp = jasmine.createSpyObj('Http', ['get', 'post']);
    mockHttpInterceptor = jasmine.createSpyObj('InterceptedHttp', ['post', 'get']);
    mockSessionStorage = jasmine.createSpyObj('sessionStorageService', ['removeItem', 'clear']);

    mockConfig = {
      getOpenCommonBaseUrl: jasmine.createSpy('getOpenCommonBaseUrl').and.returnValue('http://opencommon.test/'),
      getCommonBaseURL: jasmine.createSpy('getCommonBaseURL').and.returnValue('http://common.test/'),
      getTelephonyServerURL: jasmine.createSpy('getTelephonyServerURL').and.returnValue('http://telephony.test/')
    };

    mockData = {
      cZentrixAgentID: 12345
    };

    TestBed.configureTestingModule({
      providers: [
        CzentrixServices,
        { provide: AuthorizationWrapper, useValue: mockAuthWrapper },
        { provide: Http, useValue: mockHttp },
        { provide: InterceptedHttp, useValue: mockHttpInterceptor },
        { provide: ConfigService, useValue: mockConfig },
        { provide: dataService, useValue: mockData },
        { provide: sessionStorageService, useValue: mockSessionStorage }
      ]
    });

    service = TestBed.get(CzentrixServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize URLs correctly from ConfigService', () => {
    expect(mockConfig.getOpenCommonBaseUrl).toHaveBeenCalled();
    expect(mockConfig.getCommonBaseURL).toHaveBeenCalled();
    expect(mockConfig.getTelephonyServerURL).toHaveBeenCalled();
    expect(service.openCommonUrl).toBe('http://opencommon.test/');
    expect(service.common_url).toBe('http://common.test/');
    expect(service.address).toBe('http://telephony.test/');
  });

  describe('getLoginKey', () => {
    it('should call Http.get with correct URL containing credentials', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ key: 'testKey' }) }));
      mockHttp.get.and.returnValue(Observable.of(mockResponse));

      service.getLoginKey('user', 'pass').subscribe(data => {
        expect(data.key).toBe('testKey');
      });

      const expectedUrlPart = 'apps/cust_appsHandler.php?transaction_id=CTI_LOGIN_KEY&username=user&password=pass&resFormat=3';
      expect(mockHttp.get).toHaveBeenCalledWith(jasmine.stringMatching(new RegExp(expectedUrlPart.replace('?', '\\?'))));
    });

    it('should handle error when API fails', () => {
      const mockError = new Response(new ResponseOptions({ body: JSON.stringify({ error: 'Internal Server Error' }), status: 500 }));
      mockHttp.get.and.returnValue(Observable.throw(mockError));

      service.getLoginKey('user', 'pass').subscribe(
        () => fail('Expected an error, but got a success response'),
        err => {
          expect(err.error).toBe('Internal Server Error');
        }
      );
    });
  });

  describe('agentLogout', () => {
    it('should call InterceptedHttp.post with agent_id', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ status: 'success' }) }));
      mockHttpInterceptor.post.and.returnValue(Observable.of(mockResponse));

      service.agentLogout(12345, '10.0.0.1').subscribe();

      expect(mockHttpInterceptor.post).toHaveBeenCalledWith(jasmine.any(String), { agent_id: 12345 });
    });
  });

  describe('userLogout', () => {
    it('should remove specific session keys and call logout API', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ success: true }) }));
      mockHttpInterceptor.post.and.returnValue(Observable.of(mockResponse));

      service.userLogout().subscribe();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('privilege_flag');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('session_id');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('callTransferred');
      expect(mockHttpInterceptor.post).toHaveBeenCalledWith(service.logoutUserUrl, {});
    });
  });

  describe('getAgentStatus', () => {
    it('should call AuthorizationWrapper.post with agent_id from dataService', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ state: 'READY' }) }));
      mockAuthWrapper.post.and.returnValue(Observable.of(mockResponse));

      service.getAgentStatus().subscribe();

      expect(mockAuthWrapper.post).toHaveBeenCalledWith(service._getAgentStatus_url, { agent_id: 12345 });
    });
  });

  describe('manualDialaNumber', () => {
    it('should call InterceptedHttp.post with agent_id and phone_num', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ message: 'Dialing' }) }));
      mockHttpInterceptor.post.and.returnValue(Observable.of(mockResponse));

      service.manualDialaNumber(12345, 9988776655).subscribe();

      expect(mockHttpInterceptor.post).toHaveBeenCalledWith(service._dialBeneficiary, { agent_id: 12345, phone_num: 9988776655 });
    });
  });

  describe('getIpAddress', () => {
    it('should call AuthorizationWrapper.post with the provided agentId', () => {
      const mockResponse = new Response(new ResponseOptions({ body: JSON.stringify({ ip: '127.0.0.1' }) }));
      mockAuthWrapper.post.and.returnValue(Observable.of(mockResponse));

      service.getIpAddress(999).subscribe(res => {
        expect(res.ip).toBe('127.0.0.1');
      });

      expect(mockAuthWrapper.post).toHaveBeenCalledWith(service._getAgentIPAddressURL, { agent_id: 999 });
    });
  });

});
