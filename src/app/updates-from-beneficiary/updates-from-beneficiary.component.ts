import { Component, OnInit, Input, ViewChild, DoCheck } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UpdateService } from '../services/update-services/update-service';
import { dataService } from '../services/dataService/data.service';
import { Message } from './../services/common/message.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { Subscription } from 'rxjs/Subscription';
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service'
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
declare let jQuery: any;
@Component({
  selector: 'app-updates-from-beneficiary',
  templateUrl: './updates-from-beneficiary.component.html',
  styleUrls: ['./updates-from-beneficiary.component.css']
})
export class UpdatesFromBeneficiaryComponent implements OnInit, DoCheck {

  currentlanguage: any;
  @ViewChild('Form') updateForm;
  occupation: any;
  educationIDs: any;
  sexualOrientationID: any;
  placeOfWork: any;
  remarks: any;
  isHIVPos = "";
  beneficiaryRegID: any=this.saved_data.benRegId;
  educationQualifications: any = [];
  sexualOrientations: any = [];
  count;
  occupationIDs: any = undefined;
  occupations: any = [];
  cameToKnowFrom: any;
  subscription: Subscription;

  sourceOfInfo: any = [
    { name: 'Pamphlet', value: 'Pamphlet', selected: false, id: 1, disabled: false },
    { name: 'Radio', value: 'Radio', selected: false, id: 2, disabled: false },
    { name: 'Television', value: 'Television', selected: false, id: 3, disabled: false },
    { name: 'Family and Friends', value: 'Family and Friends', selected: false, id: 4, disabled: false },
    { name: 'Healthcare Worker', value: 'Healthcare Worker', selected: false, id: 5, disabled: false },
    { name: 'Others', value: 'Others', selected: false, id: 6, disabled: false },
    { name: 'Newspaper', value: 'Newspaper', selected: false, id: 8, disabled: false },
    { name: 'Not Disclosed', value: 'Not Disclosed', selected: false, id: 7, disabled: false }
  ];
  currentLanguageSet: any;

  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _util: UpdateService,
    private fb: FormBuilder,
    private saved_data: dataService,
    private message: ConfirmationDialogsService,
    private pass_data: CommunicationService,
    private httpServices:HttpServices) {
    
  }


  ngOnInit() {
    this.assignSelectedLanguage();
    this.count = '0/300';
    this.subscription = this.pass_data.getData().subscribe(benData => { this.getBenData(benData) });
    console.log("benRegId--", this.saved_data);
    this.beneficiaryRegID = this.saved_data.benRegId;
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe(response => {
        this.SetUserBeneficiaryRegistrationData(response);
      }),
      (err) => {
        this.message.alert(err.errorMessage, 'error');

      }
  }

  ngOnChanges() {

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language updates frm ben tak');
  }
  PopulateUpdateData() {
    if (this.saved_data.beneficiaryData && this.saved_data.beneficiaryData.beneficiaryRegID) {
      this.beneficiaryRegID = this.saved_data.beneficiaryData.beneficiaryRegID;
      this.occupationIDs = this.saved_data.beneficiaryData.i_bendemographics.occupationID;
      this.educationIDs = this.saved_data.beneficiaryData.i_bendemographics.educationID;
      this.sexualOrientationID = this.saved_data.beneficiaryData.sexualOrientationID;
      this.placeOfWork = this.saved_data.beneficiaryData.placeOfWork; // this.saved_data.beneficiaryData.i_bendemographics.placeOfWork;
      this.isHIVPos = this.saved_data.beneficiaryData.isHIVPos;
      this.remarks = this.saved_data.beneficiaryData.remarks;
      this.cameToKnowFrom = this.saved_data.beneficiaryData.sourceOfInformation ? this.saved_data.beneficiaryData.sourceOfInformation.split(',') : undefined;
      this.populateSourceOfInformation(this.cameToKnowFrom);
      this.updateRemarksCount(this.remarks);
    }
  }
  updateRemarksCount(remarks) {
    if(remarks !== undefined && remarks !== null && remarks.length >= 0)
    {
    this.count = remarks.length + '/300';
    }
    else
    {
      this.count = '0/300';
    }
  }
  PopulateOutBoundData(beneficiaryData: any) {
    if (beneficiaryData) {
      this.beneficiaryRegID = beneficiaryData.beneficiaryRegID ? beneficiaryData.beneficiaryRegID : this.saved_data.beneficiaryRegID;
      // this.updateForm.form.patchValue({ 'occupationIDs': beneficiaryData.i_bendemographics.occupationID });

      this.occupationIDs = beneficiaryData.i_bendemographics.occupationID ? beneficiaryData.i_bendemographics.occupationID.toString() : null;
      this.educationIDs = beneficiaryData.i_bendemographics.educationID ? beneficiaryData.i_bendemographics.educationID.toString() : null;
      this.sexualOrientationID = beneficiaryData.sexualOrientationID;
      this.placeOfWork = beneficiaryData.placeOfWork; // this.saved_data.beneficiaryData.i_bendemographics.placeOfWork;
      this.isHIVPos = beneficiaryData.isHIVPos.toLowerCase();
      this.remarks = beneficiaryData.remarks;
      this.cameToKnowFrom = beneficiaryData.sourceOfInformation ? beneficiaryData.sourceOfInformation.split(',') : undefined;
      this.populateSourceOfInformation(this.cameToKnowFrom);
      this.updateRemarksCount(this.remarks);
    }
  }

  populateSourceOfInformation(cameToKnowFrom) {
    if (cameToKnowFrom && cameToKnowFrom.includes('Not Disclosed')) {
      this.sourceOfInfo = [
        { name: 'Pamphlet', value: 'Pamphlet', selected: false, id: 1, disabled: true },
        { name: 'Radio', value: 'Radio', selected: false, id: 2, disabled: true },
        { name: 'Television', value: 'Television', selected: false, id: 3, disabled: true },
        { name: 'Family and Friends', value: 'Family and Friends', selected: false, id: 4, disabled: true },
        { name: 'Healthcare Worker', value: 'Healthcare Worker', selected: false, id: 5, disabled: true },
        { name: 'Others', value: 'Others', selected: false, id: 6, disabled: true },
        { name: 'Newspaper', value: 'Newspaper', selected: false, id: 8, disabled: true },
        { name: 'Not Disclosed', value: 'Not Disclosed', selected: false, id: 7, disabled: false }
      ];
    }
    else {
      this.sourceOfInfo = [
        { name: 'Pamphlet', value: 'Pamphlet', selected: false, id: 1, disabled: false },
        { name: 'Radio', value: 'Radio', selected: false, id: 2, disabled: false },
        { name: 'Television', value: 'Television', selected: false, id: 3, disabled: false },
        { name: 'Family and Friends', value: 'Family and Friends', selected: false, id: 4, disabled: false },
        { name: 'Healthcare Worker', value: 'Healthcare Worker', selected: false, id: 5, disabled: false },
        { name: 'Others', value: 'Others', selected: false, id: 6, disabled: false },
        { name: 'Newspaper', value: 'Newspaper', selected: false, id: 8, disabled: false },
        { name: 'Not Disclosed', value: 'Not Disclosed', selected: false, id: 7, disabled: false }
      ];
    }
  }

  SetUserBeneficiaryRegistrationData(response: any) {

    if (response.sexualOrientations) {
      this.sexualOrientations = response.sexualOrientations;
    }
    if (response.i_BeneficiaryEducation) {
      this.educationQualifications = response.i_BeneficiaryEducation;
    }
    if (response.beneficiaryOccupations) {
      this.occupations = response.beneficiaryOccupations;
    }
  }

  updateBeneficiary(values: any) {
    const newOtherData: any = {};
    if(this.saved_data.benRegId != undefined && this.saved_data.benRegId != null){
    this.saved_data.beneficiaryData.beneficiaryRegID = this.saved_data.benRegId;
    values.beneficiaryRegID = this.saved_data.benRegId;
    }
    else{
      this.saved_data.beneficiaryData.beneficiaryRegID = this.saved_data.beneficiaryRegID;
      values.beneficiaryRegID = this.saved_data.beneficiaryRegID;
    }
   
    this.saved_data.beneficiaryData.isHIVPos = values.isHIVPos;
    // if(this.saved_data.beneficiaryData.i_bendemographics !=undefined
    //    && this.saved_data.beneficiaryData.i_bendemographics.occupationID 
    //    && this.saved_data.beneficiaryData.i_bendemographics.educationID)
    //    {
    this.saved_data.beneficiaryData.i_bendemographics.occupationID = values.occupationIDs; // values.occupation;
    this.saved_data.beneficiaryData.i_bendemographics.educationID = values.educationIDs;
    this.saved_data.beneficiaryData.i_bendemographics.beneficiaryRegID = values.beneficiaryRegID;
      //  }
      //  else{
      //   this.saved_data.beneficiaryData.i_bendemographics={};
      //   this.saved_data.beneficiaryData.i_bendemographics.occupationID = values.occupationIDs; // values.occupation;
      //   this.saved_data.beneficiaryData.i_bendemographics.educationID = values.educationIDs;
      //   this.saved_data.beneficiaryData.i_bendemographics.beneficiaryRegID = values.beneficiaryRegID;
      //  }
    this.saved_data.beneficiaryData.sexualOrientationID = values.sexualOrientationID;
    this.saved_data.beneficiaryData.placeOfWork = values.placeOfWork;
    this.saved_data.beneficiaryData.remarks = values.remarks;
    this.saved_data.beneficiaryData.sourceOfInformation = values.cameToKnowFrom ? values.cameToKnowFrom.toString() : undefined;
    this.saved_data.beneficiaryData.is1097 = true;
    this.saved_data.beneficiaryData.changeInSelfDetails = true;
    this.saved_data.beneficiaryData.changeInAddress = true;
    this.saved_data.beneficiaryData.changeInContacts = true;
    this.saved_data.beneficiaryData.changeInIdentities = true;
    this.saved_data.beneficiaryData.changeInOtherDetails = true;
    this.saved_data.beneficiaryData.changeInFamilyDetails = true;
    this.saved_data.beneficiaryData.changeInAssociations = true;
    this.saved_data.beneficiaryData.changeInBankDetails = false;
    this.saved_data.beneficiaryData.changeInBenImage = false;

    // alert( values );
    // console.log("Update Data is", JSON.stringify(this.saved_data.beneficiaryData));
    const res = this._util.updateBeneficiaryData(this.saved_data.beneficiaryData).subscribe((response) => {
      this.showAlert();
      this.PopulateOutBoundData(response);
    }, (err) => {
      this.message.alert(err.status, 'error');
    });
  }

  showAlert() {
    this.message.alert(this.currentLanguageSet.DetailsUpdatedSuccessfully, 'success');
    console.log(this.updateForm);
   this.updateForm.form.markAsPristine();
    //this.form.reset();
  }

  checkInCaseNotDisclosed(selected_values) {
    let contains = false;
    let notDisclosedValue = "";

    for (let i = 0; i < selected_values.length; i++) {
      if (selected_values[i].toLowerCase() === 'Not Disclosed'.toLowerCase()) {
        contains = true;
        break;
      }
      else {
        contains = false;
      }
    }

    if (selected_values.length === 0) {
      contains = false;
    }

    if (contains) {
      for (let i = 0; i < this.sourceOfInfo.length; i++) {
        if (this.sourceOfInfo[i].name.toLowerCase() != 'Not Disclosed'.toLowerCase()) {
          this.sourceOfInfo[i].disabled = true;
        }
        else {
          notDisclosedValue = this.sourceOfInfo[i].value;
        }
      }

      this.cameToKnowFrom = [];
      this.cameToKnowFrom.push(notDisclosedValue);


    }
    if (!contains && this.cameToKnowFrom.length === 0) {
      for (let i = 0; i < this.sourceOfInfo.length; i++) {
        if (this.sourceOfInfo[i].name.toLowerCase() != 'Not Disclosed'.toLowerCase()) {
          this.sourceOfInfo[i].disabled = false;
        }
      }

      this.cameToKnowFrom = [];
      notDisclosedValue = "";

    }
  }

  updateCount() {
    this.count = this.remarks.length + '/300';
  }
  // get the data from diffrent commponent
  getBenData(data: any) {
    this.PopulateOutBoundData(data.dataPass);
  }
  // changeRadio(value) {
  //   if (value) {
  //     this.isHIVPos = value;
  //   } else {
  //     this.isHIVPos = false;
  //   }
  // }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	}
}
