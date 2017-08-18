import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoReferralService } from "../services/coService/co_referral.service";
import { dataService } from "../services/dataService/data.service"

@Component( {
  selector: 'app-co-referral-services',
  templateUrl: './co-referral-services.component.html',
  styleUrls: [ './co-referral-services.component.css' ]
} )
export class CoReferralServicesComponent implements OnInit
{
  @Input() current_language: any;
  currentlanguage: any;

  @Output() referralServiceProvided: EventEmitter<any> = new EventEmitter<any>();

  showFormCondition: boolean = false;
  showTableCondition: boolean = true;

  tableArray: any = [];
  states: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  branches: any = [];
  directory: any = [];
  sub_directory: any = [];
  detailsList: any = [];

  selected_state: any = undefined;
  selected_district: any = undefined;
  selected_taluk: any = undefined;
  selected_block: any = undefined;
  selected_branch: any = undefined;
  selected_directory: any = undefined;
  selected_sub_directory: any = undefined;
  description: any = undefined;
  subServiceID: number = 3;
  showSendSMS: boolean = false;
  providerServiceMapID: number;

  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _coReferralService: CoReferralService,
    private saved_data: dataService
  ) { }

  ngOnInit ()
  {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetServiceTypes();
    // // call the api to get all the referrals done and store them in array;

    // this.tableArray = []; //substitute it with the response

    // // call the api to get all the states
    // this.states = [];  //substitute it with the response
    this._userBeneficiaryData.getUserBeneficaryData()
      .subscribe( response => this.SetUserBeneficiaryRegistrationData( response ) );
    this.setBeneficiaryData();
  }

   ngOnChanges()
  {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, "language in referral tak");
  }

  GetServiceTypes ()
  {
    this._coReferralService.getTypes( this.providerServiceMapID )
      .subscribe( response => this.setServiceTypes( response ) );
  }
  setServiceTypes ( response: any )
  {
    for ( let i: any = 0; i < response.length; i++ )
    {
      if ( response[ i ].subServiceName.toUpperCase().search( "REFE" ) >= 0 )
      {
        this.subServiceID = response[ i ].subServiceID;
        break;
      }
    }
  }
  @Input()
  setBeneficiaryData ()
  {
    this._coReferralService.getReferralHistoryByID( this.saved_data.beneficiaryData.beneficiaryRegID ).subscribe( response => this.getReferralHistory( response ) );
  }

  getReferralHistory ( response: any )
  {
    console.log( 'referral history is :', response );
    this.tableArray = response;
  }


  showForm ()
  {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }

  showTable ()
  {
    this.showFormCondition = false;
    this.showTableCondition = true;
  }

  SetUserBeneficiaryRegistrationData ( regData: any )
  {
    if ( regData.states )
    {
      this.states = regData.states;
    }
    if ( regData.directory )
    {
      this.directory = regData.directory;
    }
  }

  GetDistricts ( state: number )
  {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this._locationService.getDistricts( state )
      .subscribe( response => this.SetDistricts( response ) );
  }
  SetDistricts ( response: any )
  {
    this.districts = response;
  }
  GetTaluks ( district: number )
  {
    this.taluks = [];
    this.blocks = [];
    this._locationService.getTaluks( district )
      .subscribe( response => this.SetTaluks( response ) );
    // this._locationService.getSTB( district )
    //   .subscribe( response => this.SetTaluks( response ) );
  }
  SetTaluks ( response: any )
  {
    this.taluks = response;
  }
  GetSDTB ( taluk: number )
  {
    this.blocks = [];
    this._locationService.getBranches( taluk )
      .subscribe( response => this.SetSDTB( response ) );
    // this._locationService.getBranch( taluk )
    //   .subscribe( response => this.SetBlocks( response ) );
  }
  SetSDTB ( response: any )
  {
    this.blocks = response;
  }

  GetSubDirectory ( directoryID: number )
  {
    this._locationService.getSubDirectory( directoryID )
      .subscribe( response => this.SetSubDirectory( response ) );
  }
  SetSubDirectory ( response: any )
  {
    this.sub_directory = response.subDirectory;
  }

  //GetReferralDetails ( selected_directory: number, selected_sub_directory: number, stateID: number, districtID: number, districtBranchMappingID: number, beneficiaryRegID: number, subServiceID: number, benCallID: number )
  GetReferralDetails ()
  {
    //instituteDirectoryID: number, instituteSubDirectoryID: number, stateID: number, districtID: number,
    //districtBranchMappingID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number, benCallID: number
    //this._coReferralService.getDetails( selected_directory, selected_sub_directory, stateID, districtID, districtBranchMappingID, "neer", beneficiaryRegID, subServiceID, benCallID )
    this._coReferralService.getDetails(
      this.selected_directory, this.selected_sub_directory, this.selected_state, this.selected_district, this.selected_branch,
      this.saved_data.uname, this.saved_data.beneficiaryData.beneficiaryRegID, this.subServiceID, this.saved_data.callData.benCallID
    ).subscribe( response => this.SetReferralDetails( response ) );
  }

  SetReferralDetails ( response: any )
  {
    console.log( 'success referral', response );
    this.detailsList = response;
    if ( this.detailsList.length > 0 )
    {
      this.showSendSMS = true;
    }
    this.referralServiceProvided.emit();
    this.provideReferralDescription();
  }

  provideReferralDescription ()
  {
    var refObj = {
      "state": this.selected_state,
      "district": this.selected_district,
      "taluk": this.selected_taluk,
      "block": this.selected_block,
      "selected_directory": this.selected_directory,
      "selected_sub_directory": this.selected_sub_directory,
      "date": new Date()
    }
    this.tableArray.push( refObj );

  }





}
