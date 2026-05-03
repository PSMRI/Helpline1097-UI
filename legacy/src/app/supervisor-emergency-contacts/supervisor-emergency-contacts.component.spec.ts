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
import { SupervisorEmergencyContactsComponent } from './supervisor-emergency-contacts.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';



let component: SupervisorEmergencyContactsComponent;
let fixture: ComponentFixture<SupervisorEmergencyContactsComponent>;

const FakeConfirmationDialogsService = {

}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};

class FakeNotificationService {
  getNotificationTypes(data) {
    return Observable.of([{
      notificationType: 'Emergency Contact',
      notificationTypeID: '1'
    }])
  }
  getAllDesignations(data) {
    return Observable.of([{
      notificationType: 'Emergency Contact',
      notificationTypeID: '1'
    }])
  }
  getSupervisorEmergencyContacts(data) {
    return Observable.of([{
      data: 'exampldata'
    }])
  }
}

const providerForFakeNotificationService = {
  provide: NotificationService, useClass: FakeNotificationService
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
      declarations: [SupervisorEmergencyContactsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeConfirmationDialogsService, providerForFakeNotificationService,
        providerForFakeDataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorEmergencyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Supervisor-emergency-contacts', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should set the CreatedBy after OnInit', () => {
      expect(component.createdBy).not.toBe('');
      expect(component.createdBy).toBe('piramil');
    });
    it('should set the ProviderServiceId after OnInit', () => {
      expect(component.providerServiceMapID).toBe('123');
      expect(component.providerServiceMapID).not.toBe('');
    });
    it('getNotificationTypeID method should be called on OnInit', () => {
      spyOn(component, 'getNotificationTypeID');
      component.ngOnInit();
      expect(component.getNotificationTypeID).toHaveBeenCalled();
    });
    it('getEmergencyList method should be called on OnInit', () => {
      spyOn(component, 'getEmergencyList');
      component.ngOnInit();
      expect(component.getEmergencyList).toHaveBeenCalled();
    });
    it('getAllDesignations method should be called on OnInit', () => {
      spyOn(component, 'getAllDesignations');
      component.ngOnInit();
      expect(component.getAllDesignations).toHaveBeenCalled();
    });
    it('ShowForm should be disabled for the first time', () => {
      component.ngOnInit();
      expect(component.showForm).toBeFalsy();
    });
    it('ShowEditForm should be disabled for the first time', () => {
      component.ngOnInit();
      expect(component.showEditForm).toBeFalsy();
    });
    it('ShowTable should be disabled for the first time', () => {
      component.ngOnInit();
      expect(component.showTable).not.toBeFalsy();
    });
    it('formmode should be called on back button click', fakeAsync(() => {
      spyOn(component, 'formMode');
      component.ngOnInit();
      const btn = fixture.debugElement.query(By.css('button'));
      fixture.detectChanges();
      btn.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      expect(component.formMode).toHaveBeenCalled();
    }));

  });

});