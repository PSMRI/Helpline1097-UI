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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { SupervisorTrainingResourcesComponent } from './supervisor-training-resources.component';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MaterialModule, MdSelectModule } from '@angular/material';
import { FormsModule } from "@angular/forms";
import { Md2Module } from 'md2';
import { By } from '@angular/platform-browser';

let component: SupervisorTrainingResourcesComponent;
let fixture: ComponentFixture<SupervisorTrainingResourcesComponent>;

const FakeDataService = {

    uname: 'piramil',
    uid: '1', current_service: { 'serviceID': '104' }
}

const providerForFakeDataService = {
    provide: dataService, useValue: FakeDataService
};



class fakeNotificationService {
    getNotificationTypes(data) {
        return Observable.of([{
            'notificationType': 'KM',
            'notificationTypeID': '123'
        }])
    }
    getRoles(data) {
        return Observable.of({
            data: [{
                RoleName: 'RO',
                RoleID: 12345
            }]
        })
    }
    getSupervisorNotifications(data) {
        return Observable.of({
            data: ''
        })
    }
}

const providerForFakeNotificationService = {
    provide: NotificationService, useClass: fakeNotificationService
}
class fakeConfirmationDialogsService {

}

const providerForFakeConfirmationDialogsService = {
    provide: ConfirmationDialogsService, useClass: fakeConfirmationDialogsService
}



function Initialize104coTestBed() {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SupervisorTrainingResourcesComponent],
            imports: [MaterialModule,
                MdSelectModule, FormsModule, Md2Module],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [fakeConfirmationDialogsService,
                providerForFakeDataService, providerForFakeNotificationService, providerForFakeConfirmationDialogsService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SupervisorTrainingResourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
}

describe('Supervisor-Training-resources', () => {

    fdescribe('When the component is getting loaded, then ngOninit', () => {

        Initialize104coTestBed();

        it('should be created', () => {
            expect(component).toBeTruthy();
        });
        it('component should be defined', () => {
            expect(component).toBeDefined();
        });

        it('should set roleID and serviceId to empty strings after ngOninit', () => {
            component.ngOnInit();
            expect(component.createdBy).toBe('piramil');
            expect(component.userId).toBe('1');
        });
        it('Checking the value of NotificationTypeId', () => {
            component.ngOnInit();
            expect(component.notificationTypeID).toBe('123');
        });
        it('getAllRoles method should be called on OnInit', () => {
            spyOn(component, 'getAllRoles');
            component.ngOnInit();
            expect(component.getAllRoles).toHaveBeenCalled();
        });
        it('createTrainingResource method should be called on Click of Submit when form data is valid', (() => {
            spyOn(component, 'createTrainingResource');
            component.ngOnInit();
            fixture.detectChanges();
            const button = fixture.debugElement.nativeElement.querySelector('button');
            button.disabled = false;
            fixture.detectChanges();
            button.click();
            fixture.whenStable().then(() => {
                expect(component.createTrainingResource).toHaveBeenCalled();
            })
        }));
        it('createTrainingResource method should not be called on Click of Submit when form data is not valid', (() => {
            spyOn(component, 'createTrainingResource');
            component.ngOnInit();
            fixture.detectChanges();
            const button = fixture.debugElement.nativeElement.querySelector('button');
            fixture.detectChanges();
            button.click();
            fixture.whenStable().then(() => {
                expect(component.createTrainingResource).not.toHaveBeenCalled();
            })
        }));

    });
});

