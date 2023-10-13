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


import { helpline1097SupervisorComponent } from './1097-supervisor/1097-supervisor.component';
import { helpline1097AdminComponent } from './1097-admin/1097-admin.component';
import { helpline1097CoComponent } from './1097-co/1097-co.component'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { InterceptedHttp } from './http.interceptor'
import { MdMenuModule, MdCardModule } from '@angular/material';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MdDatepickerModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';
import { CustomFormsModule } from 'ng2-validation';
import { ValidationMessagesModule } from 'ng2-custom-validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
// login components
import { loginContentClass } from './login/login.component';
import { ResetComponent } from './resetPassword/resetPassword.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { myPassword } from './directives/password/myPassword.directive';
import { myName } from './directives/name/myName.directive';
import { myName_space } from './directives/name/myName.directive';

import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmail } from './directives/email/myEmail.directive';


// dashboard components
import { dashboardContentClass } from './dashboard/dashboard.component';

import { DashboardRowHeaderComponent } from './dashboard-row-header/dashboardRowHeader.component';
import { DashboardNavigationComponent } from './dashboard-navigation/dashboardNavigation.component';
import { DashboardUserIdComponent } from './dashboard-user-id/dashboardUserId.component';
import { ActivityThisWeekComponent } from './activity-this-week/activity-this-week.component';
import { AlertsNotificationComponent } from './alerts-notifications/alerts-notifications.component';
import { DailyTasksComponent } from './daily-tasks/daily-tasks.component';
import { NewsInformationsComponent } from './news-informations/news-informations.component';
import { RatingComponent } from './rating/rating.component';
import { WeatherWarningsComponent } from './weather-warnings/weather-warnings.component';
import { ViewVersionDetailsComponent } from './view-version-details/view-version-details.component';

// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';

// innerpage components
import { InnerpageComponent } from './innerpage/innerpage.component';

//Supervisor components
import { grievanceComponent } from './supervisor-grievance/grievance.component';
import { SupervisorReportsComponent } from './supervisor-reports/supervisor-reports.component';
import { SupervisorConfigurationsComponent } from './supervisor-configurations/supervisor-configurations.component';
import { AgentStatusComponent } from './agent-status/agent-status.component';
import { BlockUnblockNumberComponent } from './block-unblock-number/block-unblock-number.component';
import { DialBeneficiaryComponent } from './dial-beneficiary/dial-beneficiary.component';
import { QualityAuditComponent } from './quality-audit/quality-audit.component';
import { CaseSheetSummaryDialogComponent } from './quality-audit/quality-audit.component';

import { SupervisorNotificationsComponent } from './supervisor-notifications/supervisor-notifications.component';
import { FeedbackService } from './services/supervisorServices/Feedbackservice.service';


//cocomponents
import { CoCounsellingServicesComponent } from './co-counselling-services/co-counselling-services.component';
import { CoFeedbackServicesComponent } from './co-feedback-services/co-feedback-services.component';
import { CoInformationServicesComponent } from './co-information-services/co-information-services.component';
import { CoReferralServicesComponent } from './co-referral-services/co-referral-services.component';
import { BeneficiaryRegistrationComponent } from './beneficiary-registration/beneficiary-registration.component';
import { ServiceRoleSelectionComponent } from './service-role-selection/service-role-selection.component';
import { CoServicesComponent } from './co-services/co-services.component';
import { UpdatesFromBeneficiaryComponent } from './updates-from-beneficiary/updates-from-beneficiary.component';
import { ClosureComponent } from './closure/closure.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';
import { CoCategoryService } from './services/coService/co_category_subcategory.service'



// material modules  
import { MdDialogModule } from '@angular/material';

// admin components
import { SuperAdminComponent } from './super-admin/super-admin.component'
import { AdminServiceProviderComponent } from './admin-service-provider/admin-service-provider.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminLanguageMasterComponent } from './admin-language-master/admin-language-master.component';
import { AdminRoleMasterComponent } from './admin-role-master/admin-role-master.component';
import { AdminServiceMasterComponent } from './admin-service-master/admin-service-master.component';
import { AdminScreenMasterComponent } from './admin-screen-master/admin-screen-master.component';
import { OutboundSearchRecordsComponent } from './outbound-search-records/outbound-search-records.component';
import { OutboundAllocateRecordsComponent } from './outbound-allocate-records/outbound-allocate-records.component';
import { OutbondWorklistComponent } from './outbond-worklist/outbond-worklist.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

// services
import { loginService } from './services/loginService/login.service';
import { RegisterService } from './services/register-services/register-service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { SPService } from './services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { UserService } from './services/adminServices/AdminUser/user.service';
import { LanguageService } from './services/adminServices/AdminLanguage/language.service';
import { RoleService } from './services/adminServices/AdminRole/Role.service';
import { ServicemasterService } from './services/adminServices/AdminService/servicemaster.service';
import { ScreenService } from './services/adminServices/AdminScreen/screen.service';
import { HttpServices } from './services/http-services/http_services.service';
import { UserBeneficiaryData } from './services/common/userbeneficiarydata.service'
import { LocationService } from './services/common/location.service';
import { CoReferralService } from './services/coService/co_referral.service';
import { CoFeedbackService } from './services/coService/co_feedback.service';
import { FeedbackTypes } from './services/common/feedbacktypes.service';
import { UpdateService } from './services/update-services/update-service';
import { CallServices } from './services/callservices/callservice.service';
import { ConfigService } from './services/config/config.service';
import { helpline1097Component } from './1097/1097.component'
import { Message } from './services/common/message.service';
import { SupervisorCallTypeReportService } from './services/supervisorServices/supervisor-calltype-reports-service.service';
import { UploadServiceService } from './services/upload-services/upload-service.service';
import { NotificationService } from './services/notificationService/notification-service';
import { OutboundSearchRecordService } from './services/outboundServices/outbound-search-records.service';
import { OutboundCallAllocationService } from './services/outboundServices/outbound-call-allocation.service';
import { OutboundWorklistService } from './services/outboundServices/outbound-work-list.service';
import { ConfirmationDialogsService } from './services/dialog/confirmation.service'
import { CommunicationService } from './services/common/communication.service'
import { CallStatisticsComponent } from './call-statistics/call-statistics.component';
import { CzentrixServices } from './services/czentrix/czentrix.service';
import { OutboundService } from './services/common/outbound.services';
import { ListnerService } from './services/common/listner.service';
import { ReloadService } from './services/common/reload.service';
import { ClearFormService } from './services/common/clearform.service';
import { OutboundReAllocationService } from './services/outboundServices/outbound-call-reallocation.service';
import { ReportsService } from './services/reports-service/reports-service';
import { AuthService } from './services/authentication/auth.service';
import { TokenInterceptor } from './services/authentication/token.interceptor';
import { AuthorizationWrapper } from './authorization.wrapper';
import { AuthorizationFactory } from './authorization.factory';
// pipes
import { FilterTable } from './pipes/filter-table.pipe'

// directives
import { CollapseDirective } from './directives/collapse/collapse.directive'


// md2 Material2  modules and components
import { Md2Module } from 'md2';
import { MdSnackBarModule, MdButtonModule } from '@angular/material';
import {  MdTabsModule} from '@angular/material/tabs';
import { BeneficiaryHistoryComponent } from './beneficiary-history/beneficiary-history.component'
import { SupervisorCalltypeReportsComponent } from './supervisor-calltype-reports/supervisor-calltype-reports.component';
import { KnowledgeManagementComponent } from './knowledge-management/knowledge-management.component';
import { FeedbackStatusComponent } from './feedback-status/feedback-status.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { AlernateEmailModelComponent } from './alernate-email-model/alernate-email-model.component'

// http factory
import { httpFactory } from './http.factory';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/common/loader.service';
import { NotificationsDialogComponent } from './notifications-dialog/notifications-dialog.component';
import { EditNotificationsComponent } from './edit-notifications/edit-notifications.component';
import { TrainingResourcesComponent } from './training-resources/training-resources.component';
import { CoAlternateNumberComponent } from './co-referral-services/co-alternate-number/co-alternate-number.component';
import { ReallocateCallsComponent } from './reallocate-calls/reallocate-calls.component';
import { SupervisorCampaignStatusComponent } from './supervisor-campaign-status/supervisor-campaign-status.component';
import { CallerAgeReportComponent } from './caller-age-report/caller-age-report.component';
import { SexualOrientationReportComponent } from './sexual-orientation-report/sexual-orientation-report.component';
import { LanguageDistributionReportComponent } from './language-distribution-report/language-distribution-report.component';
import { GenderDistributionReportComponent } from './gender-distribution-report/gender-distribution-report.component';
// import { ServiceAvailedOnCallComponent } from './closure/src/app/closure/service-availed-on-call/service-availed-on-call.component'
import { AuthGuard } from './services/authGuardService/auth-guard.services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard2 } from './services/authGuardService/auth-guard2.services';
import { COComponent } from './co/co.component';
import { DashboardReportsComponent } from './dashboard-reports/dashboard-reports.component';
import { SocketService } from './services/socketService/socket.service';
import { SupervisorLocationCommunicationComponent } from './supervisor-location-communication/supervisor-location-communication.component';
import { SupervisorAlertsNotificationsComponent } from './supervisor-alerts-notifications/supervisor-alerts-notifications.component';
import { SupervisorTrainingResourcesComponent } from './supervisor-training-resources/supervisor-training-resources.component';
import { SupervisorEmergencyContactsComponent } from './supervisor-emergency-contacts/supervisor-emergency-contacts.component';
import { ForceLogoutComponent } from './force-logout/force-logout.component';
import { ForceLogoutService } from './services/supervisorServices/forceLogoutService.service';
import { AlertsNotificationsDialogComponent } from './alerts-notifications/alerts-notifications.component';
import { ToasterModule } from 'angular2-toaster';
import { UtcDatePipe } from './utc-date.pipe';
import { EmergencyContactsViewModalComponent } from './emergency-contacts-view-modal/emergency-contacts-view-modal.component';
import { QualityAuditService } from './services/supervisorServices/quality-audit-service.service';
import { AgentForceLogoutComponent } from './agent-force-logout/agent-force-logout.component';


import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { SmsTemplateService } from './services/supervisorServices/sms-template-service.service';
import { CommonSmsDialogComponent } from './common-sms-dialog/common-sms-dialog.component';
import { MaterialModule } from './material.module';
import {CallReAllocateComponent} from './everwell-outbound-reallocate/callReallocate.component';
import {CallAllocateComponent} from './Everwell-outbound-search-call-allocate/callAllocate.component';
import { EverwellAllocateRecordsComponent } from './everwell-allocate-records/everwell-allocate-records.component';
import { EverwellOutboundWorklistComponent } from './everwell-outbound-worklist/everwell-outbound-worklist.component';
import { EverwellWorklistComponent, SupportActionModal } from './everwell-worklist/everwell-worklist.component';
import { OutboundCallWorklistsComponent } from './outbound-call-worklists/outbound-call-worklists.component';
import { EverwellGuidelinesUploadComponent } from './everwell-guidelines-upload/everwell-guidelines-upload.component';
import { SetLanguageComponent } from './set-language.component';
import { StringValidator } from './directives/stringValidator.directive';
import { userNameDirective } from './directives/userName/userName.directive';
import { textareaDirective } from './directives/textarea/textArea.directive';
import { AnswerDirective } from './directives/answer/answer.directive';
import { InputAreaDirective } from './directives/Inputfeild/inputFeild.directive';
import { QuestionnaireDirective } from './directives/questionnaire/questionnaire.directive';
import { searchIdDirective } from './directives/searchid/searchId.directive';
import { SmsTemplateDirective } from './directives/smsTemplate/smsTemplate.directive';
import { textareaDirectiveWithCopyPaste } from './directives/textarea/textareaDirectiveWithCopyPaste';
import { SmsTemplateDirectiveWithCopyPaste } from './directives/smsTemplate/smsTemplateWithcopypaste.directive';
// import { SetLanguageComponent } from './set-language.component';
//for text mask
// import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AppComponent, dashboardContentClass, loginContentClass,
    ResetComponent, myPassword, InnerpageComponent, MultiRoleScreenComponent,CallReAllocateComponent,
    DashboardRowHeaderComponent, DashboardNavigationComponent,
    DashboardUserIdComponent, ActivityThisWeekComponent,CallAllocateComponent,
    AlertsNotificationComponent, DailyTasksComponent, NewsInformationsComponent,
    RatingComponent, WeatherWarningsComponent, AdminServiceProviderComponent,
    myName, myMobileNumber, myEmail, CoCounsellingServicesComponent, myName_space,
    CoFeedbackServicesComponent, CoInformationServicesComponent,
    CoReferralServicesComponent, BeneficiaryRegistrationComponent,
    ServiceRoleSelectionComponent, CoServicesComponent, UpdatesFromBeneficiaryComponent,
    ClosureComponent, SuperAdminComponent, AdminUserComponent, AdminLanguageMasterComponent,
    AdminRoleMasterComponent, AdminServiceMasterComponent, AdminScreenMasterComponent,
    SetSecurityQuestionsComponent, SetPasswordComponent, helpline1097Component,
    helpline1097CoComponent, helpline1097AdminComponent, helpline1097SupervisorComponent,
    SupervisorReportsComponent, SupervisorConfigurationsComponent, AgentStatusComponent,
    BlockUnblockNumberComponent, DialBeneficiaryComponent, QualityAuditComponent,
    SupervisorNotificationsComponent, grievanceComponent, BeneficiaryHistoryComponent, FilterTable,
    SupervisorCalltypeReportsComponent, CollapseDirective,
    KnowledgeManagementComponent, OutboundSearchRecordsComponent, OutbondWorklistComponent, OutboundAllocateRecordsComponent,
    FeedbackStatusComponent, MessageDialogComponent, CommonDialogComponent, AlernateEmailModelComponent, LoaderComponent,
    NotificationsDialogComponent, EditNotificationsComponent, TrainingResourcesComponent,
    CallStatisticsComponent, DashboardReportsComponent,
    CoAlternateNumberComponent, SupervisorLocationCommunicationComponent,
    ReallocateCallsComponent, SupervisorAlertsNotificationsComponent,
    SupervisorCampaignStatusComponent, SupervisorTrainingResourcesComponent,
    CallerAgeReportComponent, SupervisorEmergencyContactsComponent,
    SexualOrientationReportComponent, ForceLogoutComponent,
    LanguageDistributionReportComponent, AlertsNotificationsDialogComponent,
    GenderDistributionReportComponent,
    COComponent,
    UtcDatePipe,
    EmergencyContactsViewModalComponent,
    CaseSheetSummaryDialogComponent,
    AgentForceLogoutComponent,
    SmsTemplateComponent,
    CommonSmsDialogComponent,
    ViewVersionDetailsComponent,
    EverwellAllocateRecordsComponent,
    EverwellOutboundWorklistComponent,
    EverwellWorklistComponent,
    SupportActionModal,
    OutboundCallWorklistsComponent,
    EverwellGuidelinesUploadComponent,
    SetLanguageComponent,
    StringValidator,
    userNameDirective,
    textareaDirective,
    SmsTemplateDirective,
    SmsTemplateDirectiveWithCopyPaste,
    searchIdDirective,
    QuestionnaireDirective,
    InputAreaDirective,
    AnswerDirective,
    textareaDirectiveWithCopyPaste
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MaterialModule,
    MdMenuModule,
    MdDatepickerModule,
    MdNativeDateModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MdInputModule,
    CustomFormsModule,
    ValidationMessagesModule,
    BrowserAnimationsModule,
    MdCardModule,
    ToasterModule,
    MdTabsModule,
    // TextMaskModule,
    RouterModule.forRoot([
      {
        path: 'resetPassword',
        component: ResetComponent
      },
      {
        path: 'loginContentClass',
        component: loginContentClass
      },
      {
        path: 'setQuestions',
        component: SetSecurityQuestionsComponent
      },
      {
        path: 'MultiRoleScreenComponent',
        component: MultiRoleScreenComponent,
        children: [
          {
            path: '',
            component: ServiceRoleSelectionComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'dashboard',
            component: dashboardContentClass,
            canActivate: [AuthGuard]
          },
          {
            path: 'superAdmin',
            component: SuperAdminComponent
          },
          {
            path: 'RedirectToInnerpageComponent',
            component: InnerpageComponent,
            canActivate: [AuthGuard2],
          },
          {
            path: 'InnerpageComponent',
            component: InnerpageComponent,
          },
          {
            path: 'OutboundCallWorklistsComponent',
            component: OutboundCallWorklistsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'OutboundWorkList',
            component: OutbondWorklistComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'EverwellOutboundWorkList',
            component: EverwellOutboundWorklistComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'setPassword',
        component: SetPasswordComponent
      },
      {
        path: '',
        component: loginContentClass
      },
      {
        path: 'co',
        component: helpline1097CoComponent
      },
      // {
      //   path: 'InnerpageComponent/:mobileNumber/:callID/:callCategory',
      //   component: InnerpageComponent,
      //   canActivate: [AuthGuard2],
      // }
    ]),
    Md2Module],
  entryComponents: [
    BeneficiaryHistoryComponent,
    FeedbackStatusComponent,
    MessageDialogComponent,
    AlertsNotificationsDialogComponent,
    AlernateEmailModelComponent,
    CommonDialogComponent,
    NotificationsDialogComponent,
    EditNotificationsComponent,
    CoAlternateNumberComponent,
    EmergencyContactsViewModalComponent,
    AgentForceLogoutComponent,
    CommonSmsDialogComponent,
    ViewVersionDetailsComponent,
    SupportActionModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [loginService, ClearFormService, dataService, DashboardHttpServices, SPService, RegisterService,
    UserService, LanguageService, RoleService, ServicemasterService, ScreenService, HttpServices, HttpClientModule,
    UserBeneficiaryData, LocationService, CoReferralService, CoFeedbackService, FeedbackTypes,
    UpdateService, CallServices, ConfigService, Message, SupervisorCallTypeReportService, FeedbackService, AuthGuard, AuthGuard2, SocketService,
    CoCategoryService, UploadServiceService, OutboundSearchRecordService, OutboundWorklistService,
    OutboundCallAllocationService, NotificationService, ConfirmationDialogsService, LoaderService, ForceLogoutService,
    CommunicationService, OutboundService, ListnerService, AuthService, OutboundReAllocationService, ReloadService, ReportsService,
    QualityAuditService, SmsTemplateService, {
      provide: InterceptedHttp, useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, Router, AuthService, ConfirmationDialogsService]
    },
    {
      provide: AuthorizationWrapper,
      useFactory: AuthorizationFactory,
      deps: [XHRBackend, RequestOptions, Router, AuthService, ConfirmationDialogsService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, CzentrixServices],

  bootstrap: [AppComponent]
})

export class AppModule { }
