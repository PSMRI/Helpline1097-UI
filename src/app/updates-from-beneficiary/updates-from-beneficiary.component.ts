import { Component, OnInit } from '@angular/core';
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { UpdateService } from "../services/update-services/update-service";
import { dataService } from '../services/dataService/data.service';
declare let jQuery:any;
@Component( {
  selector: 'app-updates-from-beneficiary',
  templateUrl: './updates-from-beneficiary.component.html',
  styleUrls: [ './updates-from-beneficiary.component.css' ]
} )
export class UpdatesFromBeneficiaryComponent implements OnInit
{
  occupation: any;
  educationID: any;
  sexualOrientationID: any;
  placeOfWork: any;
  remarks: any;
  isHIVPos: boolean = false;
  beneficiaryRegID: any;
  educationQualifications: any = [];
  sexualOrientations: any = [];
  count;
  occupations:any=[
    {ID:0,name:'Select Occupation'},
    {ID:1,name:'Occupation1'},
    {ID:2,name:'Ocuupation2'},
    {ID:3,name:'Ocuupation3'}
  ];
  sourceOfInfo: any = [
    { name: "Pamphlet", value: "Pamphlet", selected: false, id: 1 },
    { name: "Radio", value: "Radio", selected: false, id: 2 },
    { name: "Television", value: "Television", selected: false, id: 3 },
    { name: "Family and Friends", value: "Family and Friends", selected: false, id: 4 },
    { name: "Healthcare worker", value: "Healthcare worker", selected: false, id: 5 },
    { name: "Others", value: "Others", selected: false, id: 6 },
    { name: "Not Disclosed", value: "Not Disclosed", selected: false, id: 7 }
  ];

  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _util: UpdateService,
    private fb: FormBuilder,
    private saved_data: dataService )
  {

    // this.form = this.fb.group( {
    //   skills: this.buildSkills()
    // } );
  }
  // }

  ngOnInit ()
  {
    this._userBeneficiaryData.getUserBeneficaryData()
      .subscribe( response => this.SetUserBeneficiaryRegistrationData( response ) );
    this.PopulateUpdateData();
    this.count="0/300";
  }

  PopulateUpdateData ()
  {
    if ( this.saved_data.beneficiaryData && this.saved_data.beneficiaryData.beneficiaryRegID )
    {
      this.beneficiaryRegID = this.saved_data.beneficiaryData.beneficiaryRegID;
      this.occupation = this.saved_data.beneficiaryData.i_bendemographics.occupationID;
      this.educationID = this.saved_data.beneficiaryData.i_bendemographics.educationID;
      this.sexualOrientationID = this.saved_data.beneficiaryData.sexualOrientationID;
      this.placeOfWork = "";//this.saved_data.beneficiaryData.i_bendemographics.placeOfWork;
      this.isHIVPos = this.saved_data.beneficiaryData.isHIVPos;
    }
  }

  SetUserBeneficiaryRegistrationData ( response: any )
  {
    if ( response.sexualOrientations )
    {
      this.sexualOrientations = response.sexualOrientations;
    }
    if ( response.i_BeneficiaryEducation )
    {
      this.educationQualifications = response.i_BeneficiaryEducation;
    }
  }

  updateBeneficiary ( values: any )
  {
    console.log( values );
    let newOtherData: any = {};
    this.saved_data.beneficiaryData.isHIVPos = values.isHIVPos;
    this.saved_data.beneficiaryData.i_bendemographics.occupationID = 7;//values.occupation;
    this.saved_data.beneficiaryData.i_bendemographics.educationID = values.educationID;
    this.saved_data.beneficiaryData.i_bendemographics.beneficiaryRegID = values.beneficiaryRegID;
    this.saved_data.beneficiaryData.sexualOrientationID = values.sexualOrientationID;

    // alert( values );
    let res = this._util.updateBeneficiaryData( this.saved_data.beneficiaryData ).subscribe( response =>
    {
      this.showAlert();
    } );
  }

  showAlert ()
  {
    alert( 'Update Successful!!!!' );
  }
  updateCount()
  { 
      this.count=this.remarks.length+"/300";
  }
}

