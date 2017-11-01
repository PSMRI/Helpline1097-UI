import { helpline1097SupervisorComponent } from './1097-supervisor/1097-supervisor.component';
import { helpline1097AdminComponent } from './1097-admin/1097-admin.component';
import { helpline1097CoComponent } from './1097-co/1097-co.component'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { InterceptedHttp } from './http.interceptor'
import { MaterialModule, MdMenuModule, MdCardModule } from '@angular/material';
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

// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';

// innerpage components
import { InnerpageComponent } from './innerpage/innerpage.component';

//Supervisor components
import { supervisorFeedback } from './supervisor-grievance/grievance.component';
import { SupervisorReportsComponent } from './supervisor-reports/supervisor-reports.component';
import { SupervisorConfigurationsComponent } from './supervisor-configurations/supervisor-configurations.component';
import { AgentStatusComponent } from './agent-status/agent-status.component';
import { BlockUnblockNumberComponent } from './block-unblock-number/block-unblock-number.component';
import { DialBeneficiaryComponent } from './dial-beneficiary/dial-beneficiary.component';
import { QualityAuditComponent } from './quality-audit/quality-audit.component';
import { SupervisorNotificationsComponent } from './supervisor-notifications/supervisor-notifications.component';


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
import { ClearFormService } from './services/common/clearform.service'
// pipes
import { FilterTable } from './pipes/filter-table.pipe'

// directives
import { CollapseDirective } from './directives/collapse/collapse.directive'


// md2 Material2  modules and components
import { Md2Module } from 'md2';
import { MdSnackBarModule, MdTabsModule, MdButtonModule } from '@angular/material';

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
// import { ServiceAvailedOnCallComponent } from './closure/src/app/closure/service-availed-on-call/service-availed-on-call.component'


@NgModule({
  declarations: [
    AppComponent, dashboardContentClass, loginContentClass,
    ResetComponent, myPassword, InnerpageComponent, MultiRoleScreenComponent,
    DashboardRowHeaderComponent, DashboardNavigationComponent,
    DashboardUserIdComponent, ActivityThisWeekComponent,
    AlertsNotificationComponent, DailyTasksComponent, NewsInformationsComponent,
    RatingComponent, WeatherWarningsComponent, AdminServiceProviderComponent,
    myName, myMobileNumber, myEmail, CoCounsellingServicesComponent,
    CoFeedbackServicesComponent, CoInformationServicesComponent,
    CoReferralServicesComponent, BeneficiaryRegistrationComponent,
    ServiceRoleSelectionComponent, CoServicesComponent, UpdatesFromBeneficiaryComponent,
    ClosureComponent, SuperAdminComponent, AdminUserComponent, AdminLanguageMasterComponent,
    AdminRoleMasterComponent, AdminServiceMasterComponent, AdminScreenMasterComponent,
    SetSecurityQuestionsComponent, SetPasswordComponent, helpline1097Component,
    helpline1097CoComponent, helpline1097AdminComponent, helpline1097SupervisorComponent,
    SupervisorReportsComponent, SupervisorConfigurationsComponent, AgentStatusComponent,
    BlockUnblockNumberComponent, DialBeneficiaryComponent, QualityAuditComponent,
    SupervisorNotificationsComponent, supervisorFeedback, BeneficiaryHistoryComponent, FilterTable,
    SupervisorCalltypeReportsComponent, CollapseDirective,
    KnowledgeManagementComponent, OutboundSearchRecordsComponent, OutbondWorklistComponent, OutboundAllocateRecordsComponent,
    FeedbackStatusComponent, MessageDialogComponent, CommonDialogComponent, AlernateEmailModelComponent, LoaderComponent,
    NotificationsDialogComponent, EditNotificationsComponent, TrainingResourcesComponent,
    CallStatisticsComponent,
    CoAlternateNumberComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
    MdTabsModule,
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
        path: 'InnerpageComponent',
        component: InnerpageComponent
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
            component: ServiceRoleSelectionComponent
            // outlet: 'postLogin_router'
          },
          {
            path: 'dashboard',
            component: dashboardContentClass
            // outlet: 'postLogin_router'
          },
          {
            path: 'superAdmin',
            component: SuperAdminComponent
            // outlet: 'postLogin_router'
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
      {
        path: 'InnerpageComponent/:mobileNumber/:callID',
        component: InnerpageComponent
      }
    ]),
    Md2Module],
  entryComponents: [BeneficiaryHistoryComponent, FeedbackStatusComponent, MessageDialogComponent,
    AlernateEmailModelComponent, CommonDialogComponent, NotificationsDialogComponent, EditNotificationsComponent
    , CoAlternateNumberComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [loginService, ClearFormService, dataService, DashboardHttpServices, SPService, RegisterService,
    UserService, LanguageService, RoleService, ServicemasterService, ScreenService, HttpServices,
    UserBeneficiaryData, LocationService, CoReferralService, CoFeedbackService, FeedbackTypes,
    UpdateService, CallServices, ConfigService, Message, SupervisorCallTypeReportService,
    CoCategoryService, UploadServiceService, OutboundSearchRecordService, OutboundWorklistService,
    OutboundCallAllocationService, NotificationService, ConfirmationDialogsService, LoaderService,
    CommunicationService, OutboundService, ListnerService, ReloadService, {
      provide: InterceptedHttp,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService]
    }, CzentrixServices],

  bootstrap: [AppComponent]
})

export class AppModule { }
