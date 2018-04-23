import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlertsNotificationComponent } from './alerts-notifications.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MdDialog } from '@angular/material';
import { FormsModule } from '@angular/forms';

let component: AlertsNotificationComponent;
let fixture: ComponentFixture<AlertsNotificationComponent>;

const FakeDataService = {
    current_roleID: '',
    current_workingLocationID: '',
    current_service: {
        serviceID: ''
    },
    Userdata: {
        m_UserLangMappings: ''
    }
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const FakeNotificationService = {
    getNotificationTypes(data){
        return Observable.of({
            data: [
                {
                    notificationType: 'Alert',
                    notificationTypeID: 12345
                },
                {
                    notificationType: 'Notification',
                    notificationTypeID: 56789
                },
                {
                    notificationType: 'Language Message',
                    notificationTypeID: 54321
                },
                {
                    notificationType: 'Location Message',
                    notificationTypeID: 98765
                }
            ]
        })
    },
    getAlerts(data){
        return Observable.of({
            data: [
                {
                    notification: ''
                }
            ]
        });
    },
    getNotifications(data){
        return Observable.of({
            data: [
                {
                    notification: ''
                }
            ]
        });
    }
}

const providerForFakeNotificationService = {
  provide: NotificationService, useValue: FakeNotificationService
};

const FakeHttpService = {
}

const providerForFakeHttpService = {
  provide: DashboardHttpServices, useValue: FakeHttpService
};

const FakeDialog = {
}

const providerForFakeDialog = {
  provide: MdDialog, useValue: FakeDialog
};

function InitializeAlertsNotificationTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsNotificationComponent],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeDataService, providerForFakeNotificationService, providerForFakeHttpService, providerForFakeDialog]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('AlertsNotificationComponent', () => {
  describe('When the component is getting loaded, then ngOninit', () => {

    InitializeAlertsNotificationTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    // it('should set config objects of all alerts and notification types', () => {
    //     component.ngOnInit();
    //     expect(component.alertConfig[0].notificationTypeID).toBe(12345);
    //     expect(component.notificationConfig[0].notificationTypeID).toBe(56789);
    //     expect(component.languageConfig[0].notificationTypeID).toBe(54321);
    //     expect(component.locationConfig[0].notificationTypeID).toBe(98765);
    // });

    // it('should set all alerts and notifications length to 1', () => {
    //     component.ngOnInit();
    //     expect(component.alerts.length).toBe(1);
    //     expect(component.notifications.length).toBe(1);
    //     expect(component.languageAlerts.length).toBe(1);
    //     expect(component.locationAlerts.length).toBe(1);
    // });

  });
});