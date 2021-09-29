import { Component, OnInit, Output, Input, EventEmitter,DoCheck, ViewChild } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from '../services/dataService/data.service'
import { CoReferralService } from './../services/coService/co_referral.service'
import { Subscription } from 'rxjs/Subscription';
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
declare var jQuery: any;
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-co-counselling-services',
  templateUrl: './co-counselling-services.component.html',
  styleUrls: ['./co-counselling-services.component.css'],
  providers: [CoCategoryService]
})
export class CoCounsellingServicesComponent implements OnInit, DoCheck {

  @Input() current_language: any;
  currentlanguage: any;


  showFormCondition: boolean = false;
  showTableCondition: boolean = true;
  @ViewChild ('counsellingForm') counsellingForm: NgForm;
  @Input() resetProvideServices: any;

  @Output() counsellingServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  categoryList: any;
  subCategoryList: any;
  symptomCategory: any;
  symptomSubCategory: any;
  detailsList: any;
  serviceID: number;
  providerServiceMapID: number;
  public data: any;
  public totalRecord: any;
  subscription: Subscription;
  beneficiaryID: any=this.saved_data.beneficiaryRegID;
  getDetailsFlag: boolean = false;
  showresult: boolean;
  p = 1;
  tempFlag: any;
  assignSelectedLanguageValue: any;
  enableFileDetails: boolean=false;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService,
    private pass_data: CommunicationService,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {
    this.subscription = this.pass_data.getData().subscribe(message => { this.getData(message) });
    this.saved_data.beneficiary_regID_subject.subscribe(response => {
      this.setBenRegID(response);
    });
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetServiceTypes();
  }

  setBenRegID(data) {
    this.beneficiaryID = data.beneficiaryRegID;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);
    if (this.resetProvideServices) {
      this.tempFlag = true;

      this.showTableCondition = true;
      this.showFormCondition = false;
      this.detailsList = [];
      this.showresult = false;
    }
  }

  setLanguage(language) {
    this.currentlanguage = language;
  }

  GetServiceTypes() {
    this._coCategoryService.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }

  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].subServiceName.toUpperCase().search('COUN') >= 0) {
        this.serviceID = response[i].subServiceID;
        break;
      }
    }
    this.GetCategoriesByID();
  }

  GetCategories() {
    this._coCategoryService.getCategories()
      .subscribe(response => this.SetCategories(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }
  GetCategoriesByID() {
    this._coCategoryService.getCategoriesByID(this.serviceID)
      .subscribe(response => this.SetCategories(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }

  SetCategories(response: any) {
    console.log('success', response);
    this.categoryList = response;
  }

  GetSubCategories(id: any) {
    this.symptomSubCategory=null;
    // console.log('symcatid',this.symptomCategory);
    this._coCategoryService.getSubCategories(id)
      .subscribe(response => this.SetSubCategories(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }

  SetSubCategories(response: any) {
    console.log('success', response);
    this.subCategoryList = response;
    this.enableFileDetails=false;
    this.getDetailsFlag = false;
  }

  GetSubCategoryDetails(id: any) {
    this.showresult = true;
    this._coCategoryService.getCODetails(
      id, this.saved_data.uname, this.beneficiaryID,
      this.serviceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetSubCategoryDetails(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }
  EnabledGetDetails() {
    this.getDetailsFlag = true;
    this.enableFileDetails=false;
  }
  SetSubCategoryDetails(response: any) {
    if (response) {
      console.log('success', response);
      this.detailsList = response;
      this.getDetailsFlag = true;
      this.enableFileDetails=true;
      this.counsellingServiceProvided.emit();
      this.GetCounsellingHistory();
    }
  }
  showForm() {
    if (this.tempFlag) {
      jQuery("#counselling").trigger("reset");
      this.tempFlag = false;
    }
    this.showFormCondition = true;
    this.showTableCondition = false;
  }
  back() {
    this.GetCounsellingHistory();
    this.counsellingForm.resetForm();
    this.showFormCondition = false;
    this.showTableCondition = true;
    this.enableFileDetails = false;
  }
  GetCounsellingHistory() {
    this._coService.getCounsellingsHistoryByID(this.beneficiaryID, this.saved_data.current_service.providerServiceMapID).subscribe((res) => {
      if (res) {
        this.data = res;
        this.totalRecord = res.length;
        console.log('Information History Successfully reterive', res);
      }
      else {
        this.alertService.alert("No data found contact your administrator");
      }
    }, (err) => {
      this.alertService.alert(err.errorMessage, 'error');

      console.log('Some error reteriving Information History ', err);
    })
  }
  // get the data from diffrent commponent
  public getData(data: any) {
    this.beneficiaryID = data.dataPass.beneficiaryRegID ? data.dataPass.beneficiaryRegID : this.saved_data.beneficiaryRegID;
    this.GetCounsellingHistory();
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
}
