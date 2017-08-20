import { Component, OnInit, Input } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UpdateService } from '../services/update-services/update-service';
import { dataService } from '../services/dataService/data.service';
import { Message } from './../services/common/message.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

declare let jQuery: any;
@Component({
  selector: 'app-updates-from-beneficiary',
  templateUrl: './updates-from-beneficiary.component.html',
  styleUrls: ['./updates-from-beneficiary.component.css']
})
export class UpdatesFromBeneficiaryComponent implements OnInit {

  @Input() current_language: any;
  currentlanguage: any;

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
  occupationID: any = undefined;
  occupations: any = [];

  sourceOfInfo: any = [
    { name: 'Pamphlet', value: 'Pamphlet', selected: false, id: 1 },
    { name: 'Radio', value: 'Radio', selected: false, id: 2 },
    { name: 'Television', value: 'Television', selected: false, id: 3 },
    { name: 'Family and Friends', value: 'Family and Friends', selected: false, id: 4 },
    { name: 'Healthcare Worker', value: 'Healthcare Worker', selected: false, id: 5 },
    { name: 'Others', value: 'Others', selected: false, id: 6 },
    { name: 'Not Disclosed', value: 'Not Disclosed', selected: false, id: 7 }
  ];

  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _util: UpdateService,
    private fb: FormBuilder,
    private saved_data: dataService,
    private message: ConfirmationDialogsService) {
  }


  ngOnInit() {
    this._userBeneficiaryData.getUserBeneficaryData()
      .subscribe(response => {
        this.SetUserBeneficiaryRegistrationData(response);
      });
    this.PopulateUpdateData();

    this.count = '0/300';

  }

  ngOnChanges() {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, "language updates frm ben tak");
  }

  PopulateUpdateData() {

    if (this.saved_data.beneficiaryData && this.saved_data.beneficiaryData.beneficiaryRegID) {
      this.beneficiaryRegID = this.saved_data.beneficiaryData.beneficiaryRegID;
      this.occupationID = this.saved_data.beneficiaryData.i_bendemographics.occupationID;
      this.educationID = this.saved_data.beneficiaryData.i_bendemographics.educationID;
      this.sexualOrientationID = this.saved_data.beneficiaryData.sexualOrientationId;
      this.placeOfWork = this.saved_data.beneficiaryData.placeOfWork; // this.saved_data.beneficiaryData.i_bendemographics.placeOfWork;
      this.isHIVPos = this.saved_data.beneficiaryData.isHIVPos;
      this.remarks = this.saved_data.beneficiaryData.remarks;
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
    this.saved_data.beneficiaryData.isHIVPos = values.isHIVPos;
    this.saved_data.beneficiaryData.i_bendemographics.occupationID = values.occupationID; // values.occupation;
    this.saved_data.beneficiaryData.i_bendemographics.educationID = values.educationID;
    this.saved_data.beneficiaryData.i_bendemographics.beneficiaryRegID = values.beneficiaryRegID;
    this.saved_data.beneficiaryData.sexualOrientationId = values.sexualOrientationID;
    this.saved_data.beneficiaryData.placeOfWork = values.placeOfWork;
    this.saved_data.beneficiaryData.remarks = values.remarks;

    // alert( values );
    const res = this._util.updateBeneficiaryData(this.saved_data.beneficiaryData).subscribe((response) => {
      this.showAlert();
    }, (err) => {
      this.message.alert(err.status);
    });
  }

  showAlert() {
    this.message.alert('Update Successfully');
  }
  updateCount() {
    this.count = this.remarks.length + '/300';
  }
}
