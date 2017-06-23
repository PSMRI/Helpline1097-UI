// import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
// import { MdMenuTrigger, MdDatepicker } from '@angular/material';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RegisterService } from '../services/register-services/register-service';
import { UpdateService } from '../services/update-services/update-service';
import { Router } from '@angular/router';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { dataService } from '../services/dataService/data.service';

@Component( {
	selector: 'app-beneficiary-registration',
	templateUrl: './beneficiary-registration.component.html',
	styleUrls: [ './beneficiary-registration.component.css' ],

} )
export class BeneficiaryRegistrationComponent implements OnInit
{
	@Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
	// myDatepicker = ""; 

	FirstName: any = "";
	LastName: any = "";
	DOB: any;
	PhoneNo = "";
	GenderID: any = "";
	TitleId: any = '';
	MaritalStatusID: any = '';
	aadharNo: any = "";
	caste: any = "";
	BeneficiaryTypeID: any;
	educationQualification: any = "";
	state: any = "";
	district: any = "";
	taluk: any = "";
	village: any = "";
	pincode: any = "";
	preferredLanguage: any = "";

	ParentBenRegID: number;
	relationShips: any;

	benRegistrationResponse: any;
	benUpdationResponse: any;

	regHistoryList: any = [];

	registrationNo: any = "";

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
	// states: directory = [];
	calledEarlier: boolean = false;
	showSearchResult: boolean = false;
	notCalledEarlier: boolean = false;

	updationProcess: boolean = false;


	constructor( private _util: RegisterService, private _router: Router,
		private _userBeneficiaryData: UserBeneficiaryData, private _locationService: LocationService,
		private updateBen: UpdateService, private saved_data: dataService ) { }

	ngOnInit ()
	{
		this.getRelationships();
		this._userBeneficiaryData.getUserBeneficaryData()
			.subscribe( response => this.SetUserBeneficiaryRegistrationData( response ) );
		this.startNewCall();
	}

	reloadCall ()
	{
		this.retrieveRegHistoryByPhoneNo( this.saved_data.callerNumber );
		this.calledEarlier = false;
		this.showSearchResult = false;
		this.notCalledEarlier = false;
		this.updationProcess = false;
	}

	@Input()
	startNewCall ()
	{
		// this.retrieveRegHistoryByPhoneNo( "1234567890" );
		this.reloadCall();
		this.startCall();
	}
	startCall ()
	{
		let data: any = {};
		data.is1097 = true;
		this._util.startCall( data ).subscribe( response => this.setBenCall( response ) );
	}

	setBenCall ( response )
	{
		this.saved_data.callData = response;
	}

	SetUserBeneficiaryRegistrationData ( response: any )
	{
		let regData = response;
		if ( regData.states )
		{
			this.states = regData.states;
		}
		if ( regData.m_Status )
		{
			this.status = regData.m_Status;
		}
		if ( regData.directory )
		{
			this.directory = regData.directory;
		}

		if ( regData.i_BeneficiaryEducation )
		{
			this.benEdus = regData.i_BeneficiaryEducation;
		}
		if ( regData.m_Title )
		{
			this.titles = regData.m_Title;
		}
		if ( regData.m_genders )
		{
			this.genders = regData.m_genders;
		}
		if ( regData.m_maritalStatuses )
		{
			this.maritalStatuses = regData.m_maritalStatuses;
		}
		if ( regData.m_communities )
		{
			this.communities = regData.m_communities;
		}
		if ( regData.m_language )
		{
			this.language = regData.m_language;
		}

	}

	calledEarlierCheck ( flag )
	{
		console.log( flag );
		if ( flag === 'yes' )
		{
			this.calledEarlier = true;
			this.notCalledEarlier = false;
		}
		if ( flag === 'no' )
		{
			this.notCalledEarlier = true;
			this.calledEarlier = false;
			this.showSearchResult = false;
			console.log( this.showSearchResult );
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
			this.taluk = undefined;
			this.village = undefined;
			this.pincode = undefined;
			this.preferredLanguage = undefined;
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
	}
	SetTaluks ( response: any )
	{
		this.taluks = response;
	}
	GetBlocks ( taluk: number )
	{
		this.blocks = [];
		this._locationService.getBranches( taluk )
			.subscribe( response => this.SetBlocks( response ) );
	}
	SetBlocks ( response: any )
	{
		this.blocks = response;
	}

	registerBeneficiary1 ( values: any )
	{
		console.log( values )
		this.updatedObj = {};
		this.updatedObj.firstName = values.FirstName;
		this.updatedObj.lastName = values.LastName;
		this.updatedObj.genderID = values.GenderID;
		this.updatedObj.dOB = values.DOB;
		this.updatedObj.titleId = values.TitleId;
		this.updatedObj.maritalStatusID = values.MaritalStatusID;
		this.updatedObj.parentBenRegID = values.ParentBenRegID;
		this.updatedObj.altPhoneNo = values.PhoneNo;
		this.updatedObj.govtIdentityNo = values.aadharNo;
		this.updatedObj.deleted = false;
		this.updatedObj.createdBy = this.saved_data.Userdata.userName;
		this.updatedObj.govtIdentityTypeID = 1;
		this.updatedObj.statusID = 1;
		this.updatedObj.i_bendemographics = {};
		this.updatedObj.i_bendemographics.communityID = values.caste;
		this.updatedObj.i_bendemographics.educationID = values.educationQualification;
		this.updatedObj.i_bendemographics.stateID = values.state;
		this.updatedObj.i_bendemographics.districtID = values.district;
		this.updatedObj.i_bendemographics.blockID = values.taluk;
		this.updatedObj.i_bendemographics.districtBranchID = values.village;
		this.updatedObj.i_bendemographics.pinCode = values.pincode;
		this.updatedObj.i_bendemographics.deleted = false;
		this.updatedObj.i_bendemographics.preferredLangID = values.preferredLanguage;
		console.log( "data for update " + JSON.stringify( this.updatedObj ) );
		// return;
		let res = this._util.generateReg( this.updatedObj ).subscribe( response =>
		{
			this.benRegistrationResponse = response;
			console.log( this.benRegistrationResponse );
			this.handleRegHistorySuccess( [ response ] );
			this.showAlert();
		} );
	}

	registerBeneficiary ()
	{
		// console.log( values )
		this.updatedObj = {};
		this.updatedObj.firstName = this.FirstName;
		this.updatedObj.lastName = this.LastName;
		this.updatedObj.genderID = this.GenderID;
		if ( this.DOB )
		{
			this.updatedObj.dOB = new Date(( this.DOB ) - 1 * ( this.DOB.getTimezoneOffset() * 60 * 1000 ) ).toJSON();
		} else
		{
			this.updatedObj.dOB = undefined;
		}
		this.updatedObj.titleId = this.TitleId;
		this.updatedObj.maritalStatusID = this.MaritalStatusID;
		this.updatedObj.parentBenRegID = this.ParentBenRegID;
		this.updatedObj.altPhoneNo = this.PhoneNo;
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
		console.log( "data for update " + JSON.stringify( this.updatedObj ) );
		// return;
		let res = this._util.generateReg( this.updatedObj ).subscribe( response =>
		{
			this.benRegistrationResponse = response;
			console.log( this.benRegistrationResponse );
			this.handleRegHistorySuccess( [ response ] );
			this.showAlert();
		} );
	}

	showAlert ()
	{
		alert( 'Registration Successful!!!! Beneficiary ID is :' + this.benRegistrationResponse.beneficiaryRegID );
	}

	retrieveRegHistoryByPhoneNo ( PhoneNo: any )
	{
		let res = this._util.retrieveRegHistoryByPhoneNo( PhoneNo )
			.subscribe( response => this.handleRegHistorySuccess( response ) );
		// console.log(this.relationShips);
	}


	retrieveRegHistory ( reg_no: any )
	{
		let res = this._util.retrieveRegHistory( reg_no )
			.subscribe( response => this.handleRegHistorySuccess( response ) );
		// console.log(this.relationShips);
	}

	handleRegHistorySuccess ( response: any )
	{
		this.regHistoryList = response;
		if ( this.regHistoryList.length > 0 )
		{
			this.showSearchResult = true;
			this.notCalledEarlier = false;
			this.updationProcess = false;
		}
	}

	getRelationships ()
	{
		let res = this._util.getRelationships()
			.subscribe( response => this.handleSuccess( response ) )
		// console.log(this.relationShips);
	}

	handleSuccess ( response: any )
	{
		this.relationShips = response;
		console.log( this.relationShips );
	}

	// setting the data of selected beneficiary on the top section as BEN. Data for 
	// the agent to see
	passBenRegHistoryData ( benRegData: any )
	{
		console.log( 'data passed', benRegData );
		this.onBenRegDataSelect.emit( benRegData );
		this.notCalledEarlier = true;
		this.calledEarlier = false;
		this.showSearchResult = false;
		this.updationProcess = true;

		// setting of form (prepopulated on clicking of any table row with that row data)
		// this.FirstName =benRegData.firstName;
		// this.LastName =benRegData.lastName;
		// this.GenderID = benRegData.genderID;

		// this.populateRegistrationFormForUpdate( benRegData );
		this.populateUserData( benRegData );
		this.updatebeneficiaryincall( benRegData );
	}

	updatebeneficiaryincall ( benRegData: any )
	{
		this.saved_data.callData.beneficiaryRegID = benRegData.beneficiaryRegID;
		this._util.updatebeneficiaryincall( this.saved_data.callData ).subscribe( response => console.log
			( response ) );
	}

	populateUserData ( benRegData: any )
	{
		let res = this._util.retrieveRegHistory( benRegData.beneficiaryRegID )
			.subscribe( response => this.populateRegistrationFormForUpdate( response[ 0 ] ) );
	}

	populateRegistrationFormForUpdate ( registeredBenData )
	{
		console.log( 'registered ben data is :', registeredBenData )
		this.FirstName = registeredBenData.firstName;
		this.LastName = registeredBenData.lastName;
		this.GenderID = registeredBenData.genderID;
		this.DOB = registeredBenData.dOB;
		this.TitleId = registeredBenData.titleId;
		this.MaritalStatusID = registeredBenData.maritalStatusID;
		this.ParentBenRegID = registeredBenData.parentBenRegID;
		this.PhoneNo = registeredBenData.altPhoneNo;
		this.aadharNo = registeredBenData.govtIdentityNo;
		this.caste = registeredBenData.i_bendemographics.communityID;
		this.educationQualification = registeredBenData.i_bendemographics.educationID;
		this.state = registeredBenData.i_bendemographics.stateID;
		this.district = registeredBenData.i_bendemographics.districtID;
		this.GetDistricts( registeredBenData.i_bendemographics.stateID );
		this.districts = registeredBenData.i_bendemographics.m_district;
		this.taluk = registeredBenData.i_bendemographics.blockID;
		this.GetTaluks( registeredBenData.i_bendemographics.districtID );
		this.taluks = registeredBenData.i_bendemographics.m_districtblock;
		this.village = registeredBenData.i_bendemographics.districtBranchID;
		this.GetBlocks( registeredBenData.i_bendemographics.blockID );
		this.blocks = registeredBenData.i_bendemographics.m_districtbranchmapping;
		this.pincode = registeredBenData.i_bendemographics.pinCode;
		this.preferredLanguage = registeredBenData.i_bendemographics.preferredLangID;
		this.updatedObj = registeredBenData;
		this.saved_data.beneficiaryData = registeredBenData;
	}

	updatedObj: any = {};

	updateBeneficiary ()
	{
		// console.log('to be updated values');
		this.updatedObj.firstName = this.FirstName;
		this.updatedObj.lastName = this.LastName;
		this.updatedObj.genderID = this.GenderID;
		if ( this.DOB )
		{
			this.DOB = new Date( this.DOB );
			this.updatedObj.dOB = new Date(( this.DOB ) - 1 * ( this.DOB.getTimezoneOffset() * 60 * 1000 ) ).toJSON();
		} else
		{
			this.updatedObj.dOB = undefined;
		}
		this.updatedObj.titleId = this.TitleId;
		this.updatedObj.maritalStatusID = this.MaritalStatusID;
		this.updatedObj.parentBenRegID = this.ParentBenRegID;
		this.updatedObj.altPhoneNo = this.PhoneNo;
		this.updatedObj.govtIdentityNo = this.aadharNo;

		if ( !this.updatedObj.i_bendemographics.beneficiaryRegID )
		{
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
		console.log( 'updated Obj is ', this.updatedObj );

		// saving the updated ben data in the in_app_saved data service file
		this.saved_data.beneficiaryData = this.updatedObj;

		this.updateBen.updateBeneficiaryData( this.updatedObj ).subscribe( response =>
			this.updateSuccessHandeler( response )
		);



	}

	updateSuccessHandeler ( response )
	{
		this.benUpdationResponse = response;
		console.log( "Ben Updation Response", this.benUpdationResponse );
		this.regHistoryList = [ response ];
		this.showSearchResult = true;
		this.notCalledEarlier = false;
		this.updationProcess = false;
	}
}
