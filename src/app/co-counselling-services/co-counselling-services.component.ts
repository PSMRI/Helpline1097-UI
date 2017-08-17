import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from "../services/dataService/data.service"
import { CoReferralService } from './../services/coService/co_referral.service'

@Component({
  selector: 'app-co-counselling-services',
  templateUrl: './co-counselling-services.component.html',
  styleUrls: ['./co-counselling-services.component.css'],
  providers: [CoCategoryService]
})
export class CoCounsellingServicesComponent implements OnInit {
  showFormCondition: boolean = false;
  showTableCondition: boolean = true;
  @Output() counsellingServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  categoryList: any;
  subCategoryList: any;
  symptomCategory: any;
  symptomSubCategory: any;
  detailsList: any;
  serviceID: number;
  public data: any;
  public totalRecord: any;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService
  ) {
  }

  ngOnInit() {
    this.GetServiceTypes();
  }

  GetServiceTypes() {
    this._coCategoryService.getTypes()
      .subscribe(response => this.setServiceTypes(response));
  }

  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].serviceNameFor1097.toUpperCase().search("COUN") >= 0) {
        this.serviceID = response[i].serviceID1097;
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
  }

  GetSubCategoryDetails(id: any) {
    this._coCategoryService.getCODetails(
      id, this.saved_data.uname, this.saved_data.beneficiaryData.beneficiaryRegID,
      this.serviceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetSubCategoryDetails(response));
  }

  SetSubCategoryDetails(response: any) {
    console.log('success', response);
    this.detailsList = response;
    this.counsellingServiceProvided.emit();
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
    this._coService.getCounsellingsHistoryByID(this.saved_data.beneficiaryData.beneficiaryRegID).subscribe((res) => {
      this.data = res;
      this.totalRecord = res.length;
      console.log('Information History Successfully reterive', res);
    }, (err) => {
      console.log('Some error reteriving Information History ', err);
    })
  }
}
