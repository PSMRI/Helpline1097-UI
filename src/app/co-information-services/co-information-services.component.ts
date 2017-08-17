import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'
import { dataService } from '../services/dataService/data.service'
import { CoReferralService } from './../services/coService/co_referral.service'

@Component( {
  selector: 'app-co-information-services',
  templateUrl: './co-information-services.component.html',
  styleUrls: [ './co-information-services.component.css' ]
} )
export class CoInformationServicesComponent implements OnInit
{

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
  constructor(

    private _coCategoryService: CoCategoryService,
    private saved_data: dataService,
    private _coService: CoReferralService
  )

  {
  }

  ngOnInit ()
  {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetInformationHistory();
    // Add here
    this.GetServiceTypes();
  }

  ngOnChanges()
  {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, "language info tk");
  }
  GetServiceTypes ()
  {

    this._coCategoryService.getTypes( this.providerServiceMapID )
      .subscribe( response => this.setServiceTypes( response ) );

  }
  setServiceTypes ( response: any )
  {
    for ( let i: any = 0; i < response.length; i++ )
    {
      if ( response[ i ].subServiceName.toUpperCase().search( "INFO" ) >= 0 )
      {
        this.subServiceID = response[ i ].subServiceID;
        break;
      }
    }
    this.GetCategoriesByID();
  }
  GetCategories ()
  {
    this._coCategoryService.getCategories()
    .subscribe( response => this.SetCategories( response ) );
  }
  GetCategoriesByID ()
  {

    this._coCategoryService.getCategoriesByID( this.subServiceID )
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
      this.subServiceID, this.symptomCategory, this.saved_data.callData.benCallID
    ).subscribe( response => this.SetSubCategoryDetails( response ) );



  }

  SetSubCategoryDetails ( response: any )
  {

    console.log( 'success', response );
    this.detailsList = response;
    this.informationServiceProvided.emit();
  }
  showForm ()
  {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }
  back ()
  {
    this.GetInformationHistory();
    this.showFormCondition = false;
    this.showTableCondition = true;

  }
  GetInformationHistory ()
  {

    this._coService.getInformationsHistoryByID( this.saved_data.beneficiaryData.beneficiaryRegID ).subscribe(( res ) =>
    {
      this.data = res;
      this.totalRecord = res.length;
      console.log( 'Information History Successfully reterive', res );
    }, ( err ) =>
      {
        console.log( 'Some error reteriving Information History ', err );
      } )
  }

}
