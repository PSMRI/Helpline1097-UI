import { Component, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpServices } from '../services/http-services/http_services.service';
import { SPService } from '../services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { MdMenuTrigger, MdDatepicker } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';


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
  constructor(private _SPService: SPService,private HttpServices:HttpServices) {
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
    console.log(this.userForm.value)
    this._SPService.saveProviders(bodyString)
      .subscribe(resProviderData => this.showProviders(resProviderData));
    this._SPService.getProviders()
      .subscribe(resProviderData => this.providers(resProviderData));

    this.showCreate();
  }
  showProviders(data) {
    console.log(JSON.parse(data));
  }

  providers(data) {
    this.serviceProviders = data;
    console.log(data);
  };

  fileEvent(fileInput: any) {
    let logofile = fileInput.target.files[0];

    let logofileValue;
    console.log(fileInput.target.value);
    if (logofile) {
      console.log(logofile);
      var reader = new FileReader();
      reader.onload = function (e: any) {

        console.log(e.target.result);
        //logofileValue=e.target.result.filePath;	
      }
      reader.readAsDataURL(logofile);
      //this.userForm.controls.logoFilePath.setValue(logofileValue);	
    }
    // file.filePath;
    //console.log("filePath:"+fileInput.target.files[0]);

  }
  deleteSP(i) {
    console.log(JSON.stringify(i.ServiceProviderId));
    // var obj=JSON.parse(i) ;
    // console.log(i.ServiceProviderName)
    // let id:number =i;
    let deleteReq = ('{"serviceProviderId":"' + i.ServiceProviderId + '"}');
    console.log(deleteReq);
    // //console.log('{"serviceProviderId":"'+i+'"}');

    this._SPService.deleteProviders(JSON.parse(deleteReq))
      .subscribe(responseProviderDel => this.providers(responseProviderDel));
    alert(this.currentLanguageSet.dataDeleted);
  }

  updateSP(SPData) {
    console.log("SPData" + JSON.stringify(SPData));
    let dataToUpdate = SPData;
    console.log(dataToUpdate);

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
