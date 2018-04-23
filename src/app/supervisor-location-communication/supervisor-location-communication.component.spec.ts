
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorLocationCommunicationComponent } from './supervisor-location-communication.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { NotificationService } from '../services/notificationService/notification-service';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';

let component: SupervisorLocationCommunicationComponent;
let fixture: ComponentFixture<SupervisorLocationCommunicationComponent>;

const FakeConfirmationDialogsService = {

}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};
const FakeDataService = {
  uname: 'piramil',
  current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};
class FakeNotificationService {

  getServiceProviderID(data) {
    return Observable.of({
      serviceProviderID: '1', serviceID: '2', stateID: '3'
    })
  }
  getOffices(data) {
    return Observable.of([{
      pSAddMapID: 'HCIT'
    }])
  }
  getNotificationTypes(data) {
    return Observable.of([{
      notificationType: 'Alert',
      notificationTypeID: '12345'
    }])
  }
}

const providerForFakeNotificationService = {
  provide: NotificationService, useClass: FakeNotificationService
};


function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorLocationCommunicationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeConfirmationDialogsService, providerForFakeDataService,
        providerForFakeNotificationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorLocationCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Supervisor-location-communication', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('checking the value of uname should not be null and shoul have some value username', () => {
      expect(component.createdBy).not.toBe('1');
      expect(component.createdBy).toBe('piramil');
    });
    it('should set the ProviderServiceId after OnInit', () => {
      expect(component.providerServiceMapID).not.toBe('');
      expect(component.providerServiceMapID).toBe('123');
    });
    it(' getServiceProviderID should be called after OnInit', () => {
      spyOn(component, 'getServiceProviderID');
      component.ngOnInit();
      expect(component.getServiceProviderID).toHaveBeenCalled;
      expect(component.providerServiceMapID).toBe('123');
    });
    it('getAllNotificationTypes method should be called after OnInit', () => {
      spyOn(component, 'getAllNotificationTypes');
      component.ngOnInit();
      expect(component.getAllNotificationTypes).toHaveBeenCalled;
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