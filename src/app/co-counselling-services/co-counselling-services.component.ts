import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from '../services/dataService/data.service'
import { CoReferralService } from './../services/coService/co_referral.service'
import { Subscription } from 'rxjs/Subscription';
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
declare var jQuery: any;

>>>>>>> 667cd8d39ff97d3b67bf9eae70bb5c298e17c273
@Component({
  selector: 'app-co-counselling-services',
  templateUrl: './co-counselling-services.component.html',
  styleUrls: ['./co-counselling-services.component.css'],
  providers: [CoCategoryService]
})
export class CoCounsellingServicesComponent implements OnInit {

  @Input() current_language: any;
  currentlanguage: any;


  showFormCondition: boolean = false;
  showTableCondition: boolean = true;
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
  beneficiaryID: any;
  getDetailsFlag: boolean = false;
  showresult: boolean;
  p = 1;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService,
    private pass_data: CommunicationService,
    private alertService: ConfirmationDialogsService
  ) {
    this.subscription = this.pass_data.getData().subscribe(message => { this.getData(message) });
  }

  ngOnInit() {

    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetServiceTypes();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);
    if(this.resetProvideServices) {
      this.detailsList = ["anything"];
      alert(this.detailsList.length);
      jQuery("#counsellingForm").trigger("reset");
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
      .subscribe(response => this.setServiceTypes(response));
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
      .subscribe(response => this.SetCategories(response));
  }
  GetCategoriesByID() {
    this._coCategoryService.getCategoriesByID(this.serviceID)
      .subscribe(response => this.SetCategories(response));
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
    // this.getDetailsFlag = false;
  }

  GetSubCategoryDetails(id: any) {
    this.showresult = true;
    this._coCategoryService.getCODetails(
      id, this.saved_data.uname, this.beneficiaryID,
      this.serviceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetSubCategoryDetails(response));
  }
  EnabledGetDetails() {
    this.getDetailsFlag = false;
  }
  SetSubCategoryDetails(response: any) {
    if(response){
      console.log('success', response);
      this.detailsList = response;
      this.getDetailsFlag = true;
      this.counsellingServiceProvided.emit();
      this.GetCounsellingHistory();
    }
  }
  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }
  back() {
    this.GetCounsellingHistory();
    this.showFormCondition = false;
    this.showTableCondition = true;

  }
  GetCounsellingHistory() {
    this._coService.getCounsellingsHistoryByID(this.beneficiaryID).subscribe((res) => {
      if(res){
        this.data = res;
        this.totalRecord = res.length;
        console.log('Information History Successfully reterive', res);
      }
      else {
        this.alertService.alert("No Data Found Contact your administrator");
      }
    }, (err) => {
      console.log('Some error reteriving Information History ', err);
    })
  }
  // get the data from diffrent commponent
  public getData(data: any) {
    this.beneficiaryID = data.dataPass.beneficiaryRegID;
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
}
