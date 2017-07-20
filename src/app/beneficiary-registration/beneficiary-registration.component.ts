import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RegisterService } from '../services/register-services/register-service';
import { UpdateService } from '../services/update-services/update-service';
import { Router } from '@angular/router';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from '../services/common/location.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-beneficiary-registration',
  templateUrl: './beneficiary-registration.component.html',
  styleUrls: ['./beneficiary-registration.component.css'],

})
export class BeneficiaryRegistrationComponent implements OnInit {
  @Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBenSelect: EventEmitter<any> = new EventEmitter<any>(); 1

  FirstName: any = '';
  LastName: any = '';
  DOB: any;
  PhoneNo = '';
  GenderID: any = '';
  TitleId: number;
  MaritalStatusID: number;
  aadharNo: any = '';
  caste: any = '';
  BeneficiaryTypeID: number;
  educationQualification: any = '';
  state: number;
  district: number;
  taluk: number;
  village: number;
  pincode: any = '';
  preferredLanguage: number;

  ParentBenRegID: number;
  relationShips: any;

  benRegistrationResponse: any;
  benUpdationResponse: any;

  regHistoryList: any = [];

  registrationNo: any = '';
  beneficiaryParentList: any[];
  beneficiaryRelations: any[];
  states: any = [];
  titles: any = [];
  status: any = [];
  benEdus: any = [];
  genders: any = [];
  maritalStatuses: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  communities: any = [];
  directory: any = [];
  language: any = [];
  regHistory: any;
  benRegData: any;
  // states: directory = [];
  calledEarlier = false;
  showSearchResult = false;
  notCalledEarlier = false;

  updationProcess = false;
  notCalledEarlierLowerPart = false;
  minDate: Date = null;
  maxDate: Date = null;
  isParentBeneficiary = false;
  beneficiaryRelationID;

  updatedObj: any = {};
  relationshipWith: string;

  constructor(private _util: RegisterService, private _router: Router,
    private _userBeneficiaryData: UserBeneficiaryData, private _locationService: LocationService,
    private updateBen: UpdateService, private saved_data: dataService) { }

  ngOnInit() {
    this._userBeneficiaryData.getUserBeneficaryData()
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response));
    this.startNewCall();
  }

  reloadCall() {

    this.retrieveRegHistoryByPhoneNo(this.saved_data.callerNumber);
    this.calledEarlier = false;
    this.showSearchResult = false;
    this.notCalledEarlier = false;
    this.updationProcess = false;
    this.notCalledEarlierLowerPart = false;
    this.onBenRegDataSelect.emit(null);
  }

  @Input()
  startNewCall() {
    this.reloadCall();
    this.startCall();
  }
  startCall() {

    const data: any = {};
    data.callID = this.saved_data.callID;
    data.is1097 = true;
    data.createdBy = this.saved_data.uname;
    data.calledServiceID = this.saved_data.current_service.serviceID;
    this._util.startCall(data).subscribe(response => this.setBenCall(response));
  }

  setBenCall(response) {
    this.saved_data.callData = response;
  }

  SetUserBeneficiaryRegistrationData(response: any) {

    const regData = response;
    if (regData.states) {
      this.states = regData.states;
    }
    if (regData.m_Status) {
      this.status = regData.m_Status;
    }
    if (regData.directory) {
      this.directory = regData.directory;
    }

    if (regData.i_BeneficiaryEducation) {
      this.benEdus = regData.i_BeneficiaryEducation;
    }
    if (regData.m_Title) {
      this.titles = regData.m_Title;
    }
    if (regData.m_genders) {
      this.genders = regData.m_genders;
    }
    if (regData.m_maritalStatuses) {
      this.maritalStatuses = regData.m_maritalStatuses;
    }
    if (regData.m_communities) {
      this.communities = regData.m_communities;
    }
    if (regData.m_language) {
      this.language = regData.m_language;
    }
    this.beneficiaryRelations = regData.benRelationshipTypes;
  }

  calledEarlierCheck(flag) {

    if (flag === 'yes') {
      this.calledEarlier = true;
      this.showSearchResult = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      // If condition added for preveting extra api call on radio click.
      if (this.regHistoryList.length > 0) {
        this.onBenRegDataSelect.emit(null);
      }
    }

    if (flag === 'no') {
      this.isParentBeneficiary = false;
      this.notCalledEarlier = true;

      this.notCalledEarlierLowerPart = false;

      this.onBenRegDataSelect.emit(null);
      this.calledEarlier = false;
      this.showSearchResult = false;
      this.updationProcess = false;
      this.FirstName = undefined;
      this.LastName = undefined;
      this.PhoneNo = undefined;
      this.GenderID = undefined;
      this.TitleId = undefined;
      this.MaritalStatusID = undefined;
      this.DOB = undefined;
      this.aadharNo = undefined;
      this.caste = undefined;
      this.BeneficiaryTypeID = undefined;
      this.educationQualification = undefined;
      this.state = undefined;
      this.district = undefined;
      this.districts = [];
      this.taluk = undefined;
      this.taluks = [];
      this.village = undefined;
      this.blocks = [];
      this.pincode = undefined;
      this.preferredLanguage = undefined;
      // if ()
      // this.beneficiaryRelationID = this.getRelationShipType(this.beneficiaryRelations);
      // this value also comes from the constants

    }
  }

  GetDistricts(state: number) {
    this.districts = [];

    this.taluks = [];

    this.blocks = [];

    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response));
  }
  SetDistricts(response: any) {
    // this.districts.push( { "districtID": undefined, "districtName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // this.districts.push( response[ i ] );
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response));
  }
  SetTaluks(response: any) {
    this.taluks = response;
    // this.taluks.push( { "blockID": undefined, "blockName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // 	this.taluks.push( response[ i ] );
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetBlocks(response));
  }
  SetBlocks(response: any) {
    this.blocks = response;
    // this.blocks.push( { "districtBranchID": undefined, "villageName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // 	this.blocks.push( response[ i ] );
  }

	/**
		* Neeraj Code; 22-jun-2017
		*/
  capturePrimaryInfo() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
  }

  captureOtherInfo() {
    this.notCalledEarlierLowerPart = true;
    this.notCalledEarlier = false;
  }

  editBenPrimaryContent() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
  }
	/**
	 *End of Neeraj Code; 22-jun-2017
	 */

  registerBeneficiary() {

    this.updatedObj = {};
    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    this.updatedObj.benPhoneMaps = [];
    this.updatedObj.benPhoneMaps[0] = {};
    this.updatedObj.benPhoneMaps[0].parentBenRegID = this.ParentBenRegID;
    this.updatedObj.benPhoneMaps[0].benRelationshipID = this.beneficiaryRelationID;
    this.updatedObj.benPhoneMaps[0].phoneNo = this.saved_data.callerNumber;
    this.updatedObj.benPhoneMaps[0].createdBy = this.saved_data.uname;
    this.updatedObj.benPhoneMaps[0].deleted = false;
    if (this.PhoneNo) {
      this.updatedObj.benPhoneMaps[1] = {};
      this.updatedObj.benPhoneMaps[1].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[1].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[1].phoneNo = this.PhoneNo;
      this.updatedObj.benPhoneMaps[1].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[1].deleted = false;
    }
    this.updatedObj.govtIdentityNo = this.aadharNo;
    this.updatedObj.deleted = false;
    this.updatedObj.createdBy = this.saved_data.Userdata.userName;
    this.updatedObj.govtIdentityTypeID = 1;
    this.updatedObj.statusID = 1;
    this.updatedObj.i_bendemographics = {};
    this.updatedObj.i_bendemographics.communityID = this.caste;
    this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.deleted = false;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;

    const res = this._util.generateReg(this.updatedObj).subscribe(response => {
      this.benRegistrationResponse = response;
      this.handleRegHistorySuccess([response]);
      this.showAlert();
    });
  }

  showAlert() {
    alert('Registration Successful!!!! Beneficiary ID is :' + this.benRegistrationResponse.beneficiaryRegID);
  }

  retrieveRegHistoryByPhoneNo(PhoneNo: any) {
    const res = this._util.retrieveRegHistoryByPhoneNo(PhoneNo)
      .subscribe(response => this.handleRegHistorySuccess(response));

  }


  retrieveRegHistory(reg_no: any) {
    const res = this._util.retrieveRegHistory(reg_no)
      .subscribe(response => this.handleRegHistorySuccess(response));

  }

  handleRegHistorySuccess(response: any) {
    this.regHistoryList = response;
    if (this.regHistoryList.length > 0) {
      this.showSearchResult = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.saved_data.parentBeneficiaryData = this.regHistoryList[0];
      this.relationshipWith = 'Relationship with ' + this.regHistoryList[0].firstName + ' ' + this.regHistoryList[0].lastName;
      // if (this.getParentData(this.regHistoryList[0].benPhoneMaps[0].parentBenRegID)) {
      //   this.isParentBeneficiary = true;
      // }
    }

  }

  handleSuccess(response: any) {
    this.relationShips = response;
  }

  // setting the data of selected beneficiary on the top section as BEN. Data for
  // the agent to see
  passBenRegHistoryData(benRegData: any) {
    this.notCalledEarlier = true;
    this.calledEarlier = false;
    this.showSearchResult = false;
    this.updationProcess = true;
    this.isParentBeneficiary = true;
    this.populateUserData(benRegData);
  }

  updatebeneficiaryincall(benRegData: any) {
    this.saved_data.callData.beneficiaryRegID = benRegData.beneficiaryRegID;
    this._util.updatebeneficiaryincall(this.saved_data.callData).subscribe(response => console.log
      (response));
  }

  populateUserData(benRegData: any) {
    this.updatebeneficiaryincall(benRegData);
    const res = this._util.retrieveRegHistory(benRegData.beneficiaryRegID)
      .subscribe(response => {
        this.populateRegistrationFormForUpdate(response[0])
      });

    this.benRegData = benRegData;
  }

  populateRegistrationFormForUpdate(registeredBenData) {
    console.log('registered ben data is :', registeredBenData)
    this.FirstName = registeredBenData.firstName;
    this.LastName = registeredBenData.lastName;
    this.GenderID = registeredBenData.genderID;
    this.DOB = registeredBenData.dOB;
    this.TitleId = registeredBenData.titleId;
    this.MaritalStatusID = registeredBenData.maritalStatusID;
    if (registeredBenData.benPhoneMaps[0]) {
      this.ParentBenRegID = registeredBenData.benPhoneMaps[0].parentBenRegID;
    }
    if (registeredBenData.benPhoneMaps[1]) {
      this.PhoneNo = registeredBenData.benPhoneMaps[1].phoneNo;
    }
    this.aadharNo = registeredBenData.govtIdentityNo;
    this.caste = registeredBenData.i_bendemographics.communityID;
    this.educationQualification = registeredBenData.i_bendemographics.educationID;
    this.state = registeredBenData.i_bendemographics.stateID;
    this.district = registeredBenData.i_bendemographics.districtID;
    this.districts = registeredBenData.i_bendemographics.m_district;
    this.taluk = registeredBenData.i_bendemographics.blockID;

    this.taluks = registeredBenData.i_bendemographics.m_districtblock;
    this.village = registeredBenData.i_bendemographics.districtBranchID;
    this.blocks = registeredBenData.i_bendemographics.m_districtbranchmapping;
    // registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID = 2;
    // this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
    if (registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID === 1) {
      this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
      this.isParentBeneficiary = false;
    }
    else {
      this.beneficiaryRelations = this.beneficiaryRelations.filter(function (item) {
        return item.benRelationshipType !== 'Self'; // This value has to go in constant
      });
      // this.beneficiaryRelations = this.beneficiaryRelations.splice(1, 0, 'Self');
    }
    if (this.state) {
      this.GetDistricts(this.state);
    }
    if (this.district) {
      this.GetTaluks(this.district);
    }
    if (this.taluk) {
      this.GetBlocks(this.taluk);
    }
    this.pincode = registeredBenData.i_bendemographics.pinCode;
    this.preferredLanguage = registeredBenData.i_bendemographics.preferredLangID;
    this.updatedObj = registeredBenData;
    this.saved_data.beneficiaryData = registeredBenData;
    console.log('Beneficiary Data is', this.benRegData);
    this.onBenRegDataSelect.emit(this.benRegData);
    // this.onBenSelect.emit('benService');
    // this.showSearchResult = false;
    this.notCalledEarlier = true;
  }

  updateBeneficiary() {
    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.DOB = new Date(this.DOB);
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    // this.updatedObj.parentBenRegID = this.ParentBenRegID;
    // this.updatedObj.altPhoneNo = this.PhoneNo;
    let phones = this.updatedObj.benPhoneMaps.length;
    if (phones > 0) {
      phones = 1;
    }
    if (
      !this.updatedObj.benPhoneMaps[phones] ||
      !((this.updatedObj.benPhoneMaps[phones].phoneNo) && (this.updatedObj.benPhoneMaps[phones].phoneNo === this.PhoneNo))
    ) {
      this.updatedObj.benPhoneMaps[phones] = {};
      this.updatedObj.benPhoneMaps[phones].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[phones].benificiaryRegID = this.updatedObj.beneficiaryRegID;
      this.updatedObj.benPhoneMaps[phones].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[phones].phoneNo = this.PhoneNo;
      if (this.updatedObj.benPhoneMaps[phones].createdBy) {
        this.updatedObj.benPhoneMaps[phones].modifiedBy = this.saved_data.uname;
      } else {
        this.updatedObj.benPhoneMaps[phones].createdBy = this.saved_data.uname;
        this.updatedObj.benPhoneMaps[phones].deleted = false;
      }
    }
    this.updatedObj.govtIdentityNo = this.aadharNo;

    if (!this.updatedObj.i_bendemographics.beneficiaryRegID) {
      this.updatedObj.i_bendemographics.beneficiaryRegID = this.updatedObj.beneficiaryRegID;
    }
    this.updatedObj.i_bendemographics.communityID = this.caste;
    this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;


    // saving the updated ben data in the in_app_saved data service file
    this.saved_data.beneficiaryData = this.updatedObj;
    // return;

    this.updateBen.updateBeneficiaryData(this.updatedObj).subscribe(response =>
      this.updateSuccessHandeler(response)
    );
  }

  updateSuccessHandeler(response) {
    this.benUpdationResponse = response;
    // this.regHistoryList = [response];
    this.regHistoryList = '';
    this.regHistoryList = [response];
    this.showSearchResult = true;
    this.notCalledEarlier = false;
    this.updationProcess = false;
		/**
		 *Neeraj Code; 22-jun-2017
		 */
    this.notCalledEarlierLowerPart = false;
		/**
	 *End of Neeraj Code; 22-jun-2017
	 */
  }

	/**
	 * NEERAJ; Select beneficiary for service provided; 27-JUN-2017
	 */
  selectBeneficiary(regHistory: any) {

    this.saved_data.benRegId = regHistory.beneficiaryRegID;
    this.populateUserData(regHistory);
    this.onBenSelect.emit('benService');
    this.showSearchResult = false;
    this.notCalledEarlierLowerPart = false;


  }

  getRelationShipType(relationShips) {
    this.beneficiaryRelationID = relationShips.filter(function (item) {
      return item.benRelationshipType === 'Self'; // This value has to go in constant
    });
    return this.beneficiaryRelationID[0]['benRelationshipID'];

  }

  getParentData(parentBenID) {
    this._util.retrieveRegHistory(parentBenID).subscribe(response => {
      console.log('Parent Data is ', response);
      this.beneficiaryParentList = response;
    })

  }
}
