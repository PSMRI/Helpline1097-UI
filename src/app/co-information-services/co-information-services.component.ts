import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from '../services/dataService/data.service'
import { CoReferralService } from './../services/coService/co_referral.service'
import { Subscription } from 'rxjs/Subscription';
declare var jQuery: any;
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service'
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-co-information-services',
  templateUrl: './co-information-services.component.html',
  styleUrls: ['./co-information-services.component.css']
})
export class CoInformationServicesComponent implements OnInit {

  currentLanguageSet: any;

  showFormCondition: boolean = false;
  showTableCondition: boolean = true;
  @Input() resetProvideServices: any;

  @Output() informationServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  categoryList: any;
  subCategoryList: any;
  symptomCategory: any;
  symptomSubCategory: any;
  detailsList: any;
  subServiceID: number;
  showresult: boolean;
  providerServiceMapID: number;
  public data: any;
  public totalRecord: any;
  dataToGet: any;
  subscription: Subscription;
  beneficiaryID: any=this.saved_data.beneficiaryRegID;
  benCallID: any;
  getDetailsFlag: boolean = false;
  tempFlag: any;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService,
    private pass_data: CommunicationService, 
    public alertService: ConfirmationDialogsService, 
    public HttpServices: HttpServices
  ) {
    this.subscription = this.pass_data.getData().subscribe(message => { this.getData(message) });
    this.saved_data.beneficiary_regID_subject.subscribe(response => {
      this.setBenRegID(response);
    });
    // saved_data.myBool$.subscribe((newBool: boolean) => { alert("new val in co info",newBool) });
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.subscription = this.pass_data.getData().subscribe(message => { this.getData(message) });
    
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    // Add here
    this.GetServiceTypes();

  }
   ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.resetProvideServices) {
      this.tempFlag = true;
      this.showTableCondition = true;
      this.showFormCondition = false;
      this.detailsList = [];
      this.showresult = false;
    }
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
      if (response[i].subServiceName.toUpperCase().search('INFO') >= 0) {
        this.subServiceID = response[i].subServiceID;
        break;
      }
    }
    this.GetCategoriesByID(this.subServiceID);
  }

  GetCategories() {

    this._coCategoryService.getCategories()
      .subscribe((response) => {
        this.SetCategories(response)
      },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }
  GetCategoriesByID(subServiceId) {
    this._coCategoryService.getCategoriesByID(subServiceId)
      .subscribe((response) => {
        this.SetCategories(response)
      },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }

  SetCategories(response: any) {
    console.log('success', response);
    this.categoryList = response;
  }

  GetSubCategories(id: any) {
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
  }
  EnabledGetDetails() {
    this.getDetailsFlag = false;
  }
  GetSubCategoryDetails(id: any) {
    this.showresult = true;
    this._coCategoryService.getDetails(
      id, this.saved_data.uname, this.beneficiaryID,
      this.subServiceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetSubCategoryDetails(response),
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      });
  }
  SetSubCategoryDetails(response: any) {
    console.log('success', response);
    if (response) {
      this.GetInformationHistory();
      this.detailsList = response;
      this.getDetailsFlag = true;
      this.informationServiceProvided.emit();
    }

  }
  showForm() {
    if (this.tempFlag) {
      jQuery('#informationForm').trigger("reset");
      this.tempFlag = false;
    }
    this.showFormCondition = true;
    this.showTableCondition = false;
  }
  back() {
    this.GetInformationHistory();
    this.showFormCondition = false;
    this.showTableCondition = true;

  }
  GetInformationHistory() {
    this._coService.
      getInformationsHistoryByID(this.beneficiaryID, this.saved_data.current_service.providerServiceMapID).subscribe((res) => {
        if (res) {
          this.data = res;
          this.totalRecord = res.length;
          console.log('Information History Successfully reterive', res);
        }


      },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');

      })
  }
  // get the data from diffrent commponent
  public getData(data: any) {
    this.beneficiaryID = data.dataPass.beneficiaryRegID ? data.dataPass.beneficiaryRegID : this.saved_data.beneficiaryRegID;
    this.GetInformationHistory();
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

  setBenRegID(data) {
    this.beneficiaryID = data.beneficiaryRegID;
  }
}
