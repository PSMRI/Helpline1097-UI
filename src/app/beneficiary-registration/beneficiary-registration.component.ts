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
	@Output() onBenSelect: EventEmitter<any> = new EventEmitter<any>();

	// myDatepicker = ""; 

	FirstName: any = "";
	LastName: any = "";
	DOB: any;
	PhoneNo = "";
	GenderID: any = "";
	TitleId: number;
	MaritalStatusID: number;
	aadharNo: any = "";
	caste: any = "";
	BeneficiaryTypeID: number;
	educationQualification: any = "";
	state: number;
	district: number;
	taluk: number;
	village: number;
	pincode: any = "";
	preferredLanguage: number;

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
	benRegData: any;
	// states: directory = [];
	calledEarlier: boolean = false;
	showSearchResult: boolean = false;
	notCalledEarlier: boolean = false;

	updationProcess: boolean = false;
	notCalledEarlierLowerPart: boolean = false;


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
		this.notCalledEarlierLowerPart = false;
		this.onBenRegDataSelect.emit( null );
	}

	@Input()
	startNewCall ()
	{
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
		console.log( "hey", response );

		this.language.push( { "languageID": null, "languageName": "" } );
		this.communities.push( { "communityID": null, "communityType": "" } );
		this.maritalStatuses.push( { "maritalStatusID": null, "status": "" } );
		this.genders.push( { "genderID": null, "genderName": "" } );
		this.titles.push( { "titleID": null, "titleName": "" } );
		this.benEdus.push( { "educationID": null, "educationType": "" } );
		this.states.push( { "stateID": null, "stateName": "" } );



		let regData = response;
		if ( regData.states )
		{
			//commented by neeraj
			//this.states = regData.states;


			for ( let i = 0; i < regData.states.length; i++ )
			{
				this.states.push( regData.states[ i ] );
			}
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
			//commented by neeraj
			//this.benEdus = regData.i_BeneficiaryEducation;

			for ( let i = 0; i < regData.i_BeneficiaryEducation.length; i++ )
			{
				this.benEdus.push( regData.i_BeneficiaryEducation[ i ] );
			}
		}
		if ( regData.m_Title )
		{
			//commented by neeraj
			//this.titles = regData.m_Title;

			for ( let i = 0; i < regData.m_Title.length; i++ )
			{
				this.titles.push( regData.m_Title[ i ] );
			}

		}
		if ( regData.m_genders )
		{
			//commented by neeraj
			//this.genders = regData.m_genders;

			for ( let i = 0; i < regData.m_genders.length; i++ )
			{
				this.genders.push( regData.m_genders[ i ] );
			}

		}
		if ( regData.m_maritalStatuses )
		{
			//commented by neeraj
			//this.maritalStatuses = regData.m_maritalStatuses;

			for ( let i = 0; i < regData.m_maritalStatuses.length; i++ )
			{
				this.maritalStatuses.push( regData.m_maritalStatuses[ i ] );
			}
		}
		if ( regData.m_communities )
		{
			//commented by neeraj
			//this.communities = regData.m_communities;

			for ( let i = 0; i < regData.m_communities.length; i++ )
			{
				this.communities.push( regData.m_communities[ i ] );
			}
		}
		if ( regData.m_language )
		{
			//commented by neeraj
			//this.language = regData.m_language;

			for ( let i = 0; i < regData.m_language.length; i++ )
			{
				this.language.push( regData.m_language[ i ] );
			}
		}

	}

	calledEarlierCheck ( flag )
	{
		console.log( flag );
		if ( flag === 'yes' )
		{
			this.calledEarlier = true;
			this.showSearchResult = true;
			this.notCalledEarlier = false;
			this.updationProcess = false;
			this.notCalledEarlierLowerPart = false;
			// If condition added for preveting extra api call on radio click.
			if ( this.regHistoryList.length > 0 )
			{
				//alert("hiiii....not going");
				this.onBenRegDataSelect.emit( null );
			}
			// below condition to be revisited
			// else
			// {
			// 	this.reloadCall();
			// }

			/**
			 * Neeraj Code; 22-jun-2017
			 */
			/*	this.calledEarlier = true;
				this.notCalledEarlier = false;
				this.notCalledEarlierLowerPart = false;
				if (this.showSearchResult == false)
					this.showSearchResult = true;
	
				this.updationProcess = false;
	
				this.onBenRegDataSelect.emit(null);*/
			/**
			 *End of Neeraj Code; 22-jun-2017
			 */
		}
		if ( flag === 'no' )
		{/**
			 * Neeraj Code; 22-jun-2017
			 */
			this.notCalledEarlier = true;

			this.notCalledEarlierLowerPart = false;

			this.onBenRegDataSelect.emit( null );
			/**
			*  End of Neeraj Code; 22-jun-2017
			*/
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
			this.districts = [];
			this.taluk = undefined;
			this.taluks = [];
			this.village = undefined;
			this.blocks = [];
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
		//console.log("dist",response);
		this.districts.push( { "districtID": undefined, "districtName": "" } );
		for ( let i = 0; i < response.length; i++ )
			this.districts.push( response[ i ] );
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
		//console.log("taluka", response);
		//this.taluks = response;
		this.taluks.push( { "blockID": undefined, "blockName": "" } );
		for ( let i = 0; i < response.length; i++ )
			this.taluks.push( response[ i ] );
	}
	GetBlocks ( taluk: number )
	{
		this.blocks = [];
		this._locationService.getBranches( taluk )
			.subscribe( response => this.SetBlocks( response ) );
	}
	SetBlocks ( response: any )
	{
		//console.log("block", response);
		//this.blocks = response;
		this.blocks.push( { "districtBranchID": undefined, "villageName": "" } );
		for ( let i = 0; i < response.length; i++ )
			this.blocks.push( response[ i ] );
	}

	/**
		* Neeraj Code; 22-jun-2017
		*/
	capturePrimaryInfo ()
	{
		this.notCalledEarlierLowerPart = false;
		this.notCalledEarlier = true;
	}

	captureOtherInfo ()
	{
		this.notCalledEarlierLowerPart = true;
		this.notCalledEarlier = false;
	}

	editBenPrimaryContent ()
	{
		this.notCalledEarlierLowerPart = false;
		this.notCalledEarlier = true;
	}
	/**
	 *End of Neeraj Code; 22-jun-2017
	 */

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
		this.updatedObj.benPhoneMaps = [];
		this.updatedObj.benPhoneMaps[ 0 ] = {};
		this.updatedObj.benPhoneMaps[ 0 ].parentBenRegID = this.ParentBenRegID;
		this.updatedObj.benPhoneMaps[ 0 ].benRelationshipID = undefined;
		this.updatedObj.benPhoneMaps[ 0 ].phoneNo = this.saved_data.callerNumber;
		this.updatedObj.benPhoneMaps[ 0 ].createdBy = this.saved_data.uname;
		this.updatedObj.benPhoneMaps[ 0 ].deleted = false;
		if ( this.PhoneNo )
		{
			this.updatedObj.benPhoneMaps[ 1 ] = {};
			this.updatedObj.benPhoneMaps[ 1 ].parentBenRegID = this.ParentBenRegID;
			this.updatedObj.benPhoneMaps[ 1 ].benRelationshipID = undefined;
			this.updatedObj.benPhoneMaps[ 1 ].phoneNo = this.PhoneNo;
			this.updatedObj.benPhoneMaps[ 1 ].createdBy = this.saved_data.uname;
			this.updatedObj.benPhoneMaps[ 1 ].deleted = false;
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
	}

	updatebeneficiaryincall ( benRegData: any )
	{
		this.saved_data.callData.beneficiaryRegID = benRegData.beneficiaryRegID;
		this._util.updatebeneficiaryincall( this.saved_data.callData ).subscribe( response => console.log
			( response ) );
	}

	populateUserData ( benRegData: any )
	{
		this.updatebeneficiaryincall( benRegData );
		let res = this._util.retrieveRegHistory( benRegData.beneficiaryRegID )
			.subscribe( response => this.populateRegistrationFormForUpdate( response[ 0 ] ) );
		this.benRegData = benRegData;
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
		if ( registeredBenData.benPhoneMaps[ 0 ] )
		{
			this.ParentBenRegID = registeredBenData.benPhoneMaps[ 0 ].parentBenRegID;
		}
		if ( registeredBenData.benPhoneMaps[ 1 ] )
		{
			this.PhoneNo = registeredBenData.benPhoneMaps[ 1 ].phoneNo;
		}
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
		this.onBenRegDataSelect.emit( this.benRegData );
		this.onBenSelect.emit( "benService" );
	}

	updatedObj: any = {};

	updateBeneficiary ()
	{
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
		// this.updatedObj.parentBenRegID = this.ParentBenRegID;
		// this.updatedObj.altPhoneNo = this.PhoneNo;
		let phones = this.updatedObj.benPhoneMaps.length;
		if ( phones > 0 )
		{
			phones = 1;
		}
		if (
			!this.updatedObj.benPhoneMaps[ phones ] ||
			!( ( this.updatedObj.benPhoneMaps[ phones ].phoneNo ) && ( this.updatedObj.benPhoneMaps[ phones ].phoneNo == this.PhoneNo ) )
		)
		{
			this.updatedObj.benPhoneMaps[ phones ] = {};
			this.updatedObj.benPhoneMaps[ phones ].parentBenRegID = this.ParentBenRegID;
			this.updatedObj.benPhoneMaps[ phones ].beneficiaryRegID = this.saved_data.benRegId;
			this.updatedObj.benPhoneMaps[ phones ].benRelationshipID = undefined;
			this.updatedObj.benPhoneMaps[ phones ].phoneNo = this.PhoneNo;
			if ( this.updatedObj.benPhoneMaps[ phones ].createdBy )
			{
				this.updatedObj.benPhoneMaps[ phones ].modifiedBy = this.saved_data.uname;
			} else
			{
				this.updatedObj.benPhoneMaps[ phones ].createdBy = this.saved_data.uname;
				this.updatedObj.benPhoneMaps[ phones ].deleted = false;
			}
		}
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
		//this.regHistoryList = [response];
		this.regHistoryList = "";
		this.regHistoryList = [ response ];
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
	selectBeneficiary ( regHistory: any )
	{
		this.saved_data.benRegId = regHistory.beneficiaryRegID;
		this.populateUserData( regHistory );

	}
}
