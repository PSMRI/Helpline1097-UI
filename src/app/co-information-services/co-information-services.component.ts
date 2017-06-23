import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from "../services/dataService/data.service"

@Component( {
  selector: 'app-co-information-services',
  templateUrl: './co-information-services.component.html',
  styleUrls: [ './co-information-services.component.css' ],
  providers: [ CoCategoryService ]
} )
export class CoInformationServicesComponent implements OnInit
{
  @Output() informationServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  categoryList: any;
  subCategoryList: any;
  symptomCategory: any;
  symptomSubCategory: any;
  detailsList: any;
  serviceID: number = 2;
  constructor(
    private _coCategoryService: CoCategoryService,
    private saved_data: dataService
  )
  {
  }

  ngOnInit ()
  {
    this._coCategoryService.getCategories()
      .subscribe( response => this.SetCategories( response ) );
  }

  SetCategories ( response: any )
  {
    console.log( 'success', response );
    this.categoryList = response;
  }

  GetSubCategories ( id: any )
  {
    // console.log('symcatid',this.symptomCategory);
    this._coCategoryService.getSubCategories( id )
      .subscribe( response => this.SetSubCategories( response ) );
  }

  SetSubCategories ( response: any )
  {
    console.log( 'success', response );
    this.subCategoryList = response;
  }

  GetSubCategoryDetails ( id: any )
  {
    this._coCategoryService.getDetails(
      id, this.saved_data.uname, this.saved_data.beneficiaryData.beneficiaryRegID,
      1, this.serviceID, this.saved_data.callData.benCallID
    ).subscribe( response => this.SetSubCategoryDetails( response ) );
  }

  SetSubCategoryDetails ( response: any )
  {
    console.log( 'success', response );
    this.detailsList = response;
    this.informationServiceProvided.emit();
  }
}