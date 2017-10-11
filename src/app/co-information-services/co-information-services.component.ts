import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from '../services/dataService/data.service'
import { CoReferralService } from './../services/coService/co_referral.service'
import { Subscription } from 'rxjs/Subscription';
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service'
@Component({
  selector: 'app-co-information-services',
  templateUrl: './co-information-services.component.html',
  styleUrls: ['./co-information-services.component.css']
})
export class CoInformationServicesComponent implements OnInit {

  @Input() current_language: any;
  currentlanguage: any;
  showFormCondition: boolean = false;
  showTableCondition: boolean = true;

  @Output() informationServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  categoryList: any;
  subCategoryList: any;
  symptomCategory: any;
  symptomSubCategory: any;
  detailsList: any;
  subServiceID: number;
  providerServiceMapID: number;
  public data: any;
  public totalRecord: any;
  dataToGet: any;
  subscription: Subscription;
  beneficiaryID: any;
  benCallID: any;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService,
    private pass_data: CommunicationService
  ) {
    this.subscription = this.pass_data.getData().subscribe(message => { this.getData(message) });
  }
  ngOnInit() {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    // Add here
    this.GetServiceTypes();

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);
  }

  setLanguage(language) {
    this.currentlanguage = language;
  }
  GetServiceTypes() {
    this._coCategoryService.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response));

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

      });
  }
  GetCategoriesByID(subServiceId) {
    this._coCategoryService.getCategoriesByID(subServiceId)
      .subscribe((response) => {
        this.SetCategories(response)
      },
      (err) => {

      });
  }

  SetCategories(response: any) {
    console.log('success', response);
    this.categoryList = response;
  }

  GetSubCategories(id: any) {
    // console.log('symcatid',this.symptomCategory);
    this._coCategoryService.getSubCategories(id)
      .subscribe(response => this.SetSubCategories(response));
  }

  SetSubCategories(response: any) {
    console.log('success', response);
    this.subCategoryList = response;
  }

  GetSubCategoryDetails(id: any) {
    this._coCategoryService.getDetails(
      id, this.saved_data.uname, this.beneficiaryID,
      this.subServiceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetSubCategoryDetails(response));
  }
  SetSubCategoryDetails(response: any) {
    console.log('success', response);
    this.detailsList = response;
    this.informationServiceProvided.emit();
  }
  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }
  back() {
    this.GetInformationHistory();
    this.showFormCondition = false;
    this.showTableCondition = true;

  }
  GetInformationHistory() {
    this._coService.getInformationsHistoryByID(this.beneficiaryID).subscribe((res) => {
      this.data = res;
      this.totalRecord = res.length;
      console.log('Information History Successfully reterive', res);
    }, (err) => {
      console.log('Some error reteriving Information History ', err);
    })
  }
  // get the data from diffrent commponent
  public getData(data: any) {
    this.beneficiaryID = data.dataPass.beneficiaryRegID;
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
}
