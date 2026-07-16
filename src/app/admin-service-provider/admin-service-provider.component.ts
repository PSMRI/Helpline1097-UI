/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpServices } from '../services/http-services/http_services.service';
import { SPService } from '../services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { MdMenuTrigger, MdDatepicker } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';


@Component({
  selector: 'app-admin-service-provider',
  templateUrl: './admin-service-provider.component.html',
  styleUrls: ['./admin-service-provider.component.css']
})
export class AdminServiceProviderComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  myDatepicker = '';
  currentLanguageSet: any;
  constructor(private _SPService: SPService,private HttpServices:HttpServices,
    private dialogService: ConfirmationDialogsService) {
    this.serviceProviders;
  }


  userForm = new FormGroup({

    logoFilePath: new FormControl(),
    primaryContactName: new FormControl(),
    primaryContactNo: new FormControl(),
    emailID: new FormControl(),
    address: new FormControl(),
    validity: new FormControl(),
    roleName: new FormControl(),
    roleDescription: new FormControl(),

    services: new FormControl(),
    minEducationalQualification: new FormControl(),
    specialization: new FormControl(),
    role: new FormControl(),
    zoneDistrict: new FormControl(),
    zoneName: new FormControl(),
    stateParkingPlace: new FormControl(),
    zoneParkingPlace: new FormControl(),
    districtParkingPlace: new FormControl(),
    parkingPlace: new FormControl(),
    stateServicePoint: new FormControl(),
    parkingPlaceServicePoint: new FormControl(),
    servicePoint: new FormControl(),
    loginID: new FormControl(),
    pwd: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    education: new FormControl(),
    employeeID: new FormControl(),
    aadharNo: new FormControl(),
    gender: new FormControl(),
    panNo: new FormControl(),
    father: new FormControl(),
    mother: new FormControl(),
    emergencyContactPerson: new FormControl(),
    emergencyContactNo: new FormControl(),
    serviceProviderName: new FormControl('', Validators.required),
    createdBy: new FormControl('test'),
    createdDate: new FormControl('2017-01-01'),
    stateId: new FormControl('1'),
    joiningDate: new FormControl('2017-01-01')
  });

  ngOnInit() {
    this.assignSelectedLanguage();
    this._SPService.getProviders()
      .subscribe(resProviderData => this.providers(resProviderData));
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  showCreate() {
    this.showCreateFlag = !this.showCreateFlag;
  }
  onSubmit() {
    //var bodyString=new Object

    let bodyString = this.userForm.value;

    this._SPService.saveProviders(bodyString)
      .subscribe(resProviderData => this.showProviders(resProviderData));
    this._SPService.getProviders()
      .subscribe(resProviderData => this.providers(resProviderData));

    this.showCreate();
  }
  showProviders(data) {

  }

  providers(data) {
    this.serviceProviders = data;

  };

  fileEvent(fileInput: any) {
    let logofile = fileInput.target.files[0];

    let logofileValue;

    if (logofile) {

      var reader = new FileReader();
      reader.onload = function (e: any) {

        //logofileValue=e.target.result.filePath;	
      }
      reader.readAsDataURL(logofile);
      //this.userForm.controls.logoFilePath.setValue(logofileValue);	
    }
    // file.filePath;

  }
  deleteSP(i) {

    // var obj=JSON.parse(i) ;

    // let id:number =i;
    let deleteReq = ('{"serviceProviderId":"' + i.ServiceProviderId + '"}');

    // //console.log('{"serviceProviderId":"'+i+'"}');

    this._SPService.deleteProviders(JSON.parse(deleteReq))
      .subscribe(responseProviderDel => this.providers(responseProviderDel));
    this.dialogService.alert(this.currentLanguageSet.dataDeleted, 'success');
  }

  updateSP(SPData) {

    let dataToUpdate = SPData;

    this.userForm.controls.serviceProviderName.setValue(SPData.ServiceProviderName, { onlySelf: true });
    this.userForm.controls.primaryContactName.setValue(SPData.PrimaryContactName, { onlySelf: true });
    this.userForm.controls.primaryContactNo.setValue(SPData.PrimaryContactNo, { onlySelf: true });
    this.userForm.controls.emailID.setValue(SPData.emailID, { onlySelf: true });
    this.userForm.controls.address.setValue(SPData.address, { onlySelf: true });

    this.showCreate();
    // (<FormControl>this.userForm.controls['serviceProviderName'])
    // .setValue(SPData.serviceProviderName, { onlySelf: true });

  }


}
