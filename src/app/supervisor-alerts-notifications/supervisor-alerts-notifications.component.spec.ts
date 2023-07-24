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


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorAlertsNotificationsComponent } from './supervisor-alerts-notifications.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';

let component: SupervisorAlertsNotificationsComponent;
let fixture: ComponentFixture<SupervisorAlertsNotificationsComponent>;

class FakeNotificationService {
  getServiceProviderID(data) {
    return Observable.of({
      serviceProviderID: '123',
      serviceID: '12',
      stateID: '1'
    })
  }
  getNotificationTypes(data) {
    return Observable.of([{
      notificationType: 'Alert',

    }])
  }
  getRoles(data) {
    return Observable.of({
      data: [{
        RoleName: 'ProviderAdmin',
        RoleID: '1'
      }

      ]
    })
  }
}

const providerForFakeNotificationService = {
  provide: NotificationService, useClass: FakeNotificationService
};
const FakeConfirmationDialogsService = {

}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};

const FakeDataService = {
  uname: 'piramil',
  uid: '1',
  userdata: 'abc',
  current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};


function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorAlertsNotificationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeConfirmationDialogsService,
        providerForFakeDataService, providerForFakeNotificationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorAlertsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Supervisor-alerts-notifications', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('Checking the value of Uname and serviceId should not be null', () => {
      expect(component.providerServiceMapID).not.toBe('');
      expect(component.createdBy).not.toBe('');
    });
    it('Checking the value of Uname and serviceId values should be defined', () => {
      expect(component.providerServiceMapID).toBe('123');
      expect(component.createdBy).toBe('piramil');
    });
    it('Start Date Datetime picker entry block checking  ', fakeAsync(() => {
      spyOn(component, 'blockey');
      component.ngOnInit();
      const btn = fixture.debugElement.query(By.css('md2-datepicker'))
      btn.triggerEventHandler('keydown', null);
      fixture.detectChanges();
      tick();
      expect(component.blockey).toHaveBeenCalled();
    }));
    it('End Date Datetime picker entry block checking  ', fakeAsync(() => {
      spyOn(component, 'blockey');
      component.ngOnInit();
      const btn = fixture.debugElement.query(By.css('md2-datepicker'))
      btn.triggerEventHandler('keydown', null);
      fixture.detectChanges();
      tick();
      expect(component.blockey).toHaveBeenCalled();
    }));

    it('getNotifications method should be called on click of Serach Notification button', fakeAsync(() => {
      spyOn(component, 'getNotifications');
      component.ngOnInit();
      const btn = fixture.debugElement.query(By.css('#searchNotification'));
      fixture.detectChanges();
      btn.triggerEventHandler('click', null);
      tick();
      expect(component.getNotifications).toHaveBeenCalled();
    }));

  });

});