import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {

  providerServiceMapID: any;
  serviceID: any;
  existing_templates: any = [];

  showTableFlag = true;
  viewTemplate = false;
  viewSMSparameterTable = [];

  showParameters = false;
  isReadonly = false;

  SMS_Types = [];
  smsType_ID_array = [];

  Parameters = [];
  Parameters_count;

  smsParameters = [];
  selectedParameterType;
  selectedParameterValues = [];

  smsParameterMaps = [];

  @ViewChild('smsForm') smsForm: NgForm;
  @ViewChild('vf') viewform: NgForm;
  currentLanguageSet: any;
  parameterValueType: any;
  smsParameterValue: any;
  parameterType: any;


  constructor(public commonData: dataService,
    public sms_service: SmsTemplateService,
    public commonDialogService: ConfirmationDialogsService,
    public httpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonData.current_service.serviceID; // check for each module
    this.serviceID = this.commonData.current_serviceID ? this.commonData.current_serviceID : 1; // check for each module
    this.getSMStemplates(this.providerServiceMapID);
  }

  ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  getSMStemplates(providerServiceMapID) {
    this.sms_service.getSMStemplates(providerServiceMapID)
      .subscribe(response => {
        if (response != undefined && response.length >= 0) {
          this.existing_templates = response;

          // code to extract(IDs) all those non deleted SMS-Types
          this.smsType_ID_array = [];
          for (let i = 0; i < this.existing_templates.length; i++) {
            if (this.existing_templates[i].deleted === false) {
              this.smsType_ID_array.push(this.existing_templates[i].smsType.smsTypeID);
            }
          }
        }
      }, err => {
        console.log('Error while fetching SMS templates', err);
      })
  }

  showForm() {
    this.showTableFlag = false;
    this.getSMStypes(this.serviceID);
  }

  getSMStypes(serviceID) {
    this.sms_service.getSMStypes(serviceID)
      .subscribe(response => {
        this.SMS_Types = response;

        if (this.smsType_ID_array.length > 0) {
          this.SMS_Types = this.SMS_Types.filter(object => {
            return !this.smsType_ID_array.includes(object.smsTypeID);
          });
        }


        if (this.SMS_Types.length == 0) {
          this.commonDialogService.alert(this.currentLanguageSet.allSmsTypesHaveBeenUsedAndAreThoseTemplatesAreActive, 'info');
        }

      }, err => {
        console.log(err, 'error while fetching sms types');
        this.commonDialogService.alert(err.errorMessage, 'error');
      })
  }

  showTable() {
    this.showTableFlag = true;
    this.viewTemplate = false;
    this.cancel();
    this.getSMStemplates(this.providerServiceMapID);

  }

  ActivateDeactivate(object, flag) {

    object.deleted = flag;
    object.modifiedBy = this.commonData.uname;
    this.sms_service.updateSMStemplate(object)
      .subscribe(response => {
        if (response) {
          if (flag) {
            this.commonDialogService.alert(this.currentLanguageSet.deactivatedSuccessfully, 'success');
            this.getSMStemplates(this.providerServiceMapID);

          } else {
            this.commonDialogService.alert(this.currentLanguageSet.activatedSuccessfully, 'success');
            this.getSMStemplates(this.providerServiceMapID);

          }
        }
      }, err => {

      });

  }

  extractParameters(string) {
    this.Parameters = [];
    let parameters = [];

    let string_contents = [];

    var regex = /[!?.,\n]/g;
    string_contents = string.replace(regex, ' ').split(' ');

    for (let i = 0; i < string_contents.length; i++) {
      if (string_contents[i].startsWith('$$') && string_contents[i].endsWith('$$')) {
        let item = string_contents[i].substr(2).slice(0, -2);
        console.log(item);
        parameters.push(item);
      }
    }

    this.Parameters = parameters.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });

    this.Parameters.push('SMS_PHONE_NO');
    this.Parameters_count = this.Parameters.length;

    if (this.Parameters.length > 0) {
      this.showParameters = true;
      this.isReadonly = true;
      // this.getSMSparameters();
    } else {
      this.commonDialogService.alert(this.currentLanguageSet.noParametersIdentifiedInSmsTemplate, 'info');
    }
  }


  getSMSparameters() {
    this.smsParameters = [];
    this.selectedParameterValues = [];
    if(this.smsForm.value.value !== "" && this.smsForm.value.value !== null && this.smsForm.value.value !== undefined){
      this.smsForm.value.value.smsParameterType = null;
      this.smsForm.value.value.smsParameterName = null;
      }
    this.sms_service.getSMSparameters()
      .subscribe(response => {
        this.smsParameters = response;
      }, err => {
        console.log(err, 'error while fetching sms parameters');
        this.commonDialogService.alert(err.errorMessage, 'error');
      })
  }

  setValuesInDropdown(parameter_object) {
    this.selectedParameterType = parameter_object.smsParameterType;
    this.selectedParameterValues = parameter_object.smsParameters;
  }

  cancel() {
    this.Parameters_count = undefined;
    this.isReadonly = false;
    this.showParameters = false;
    this.smsParameterMaps = [];
  }

  add(form_values) {
    if(form_values !== undefined && form_values !== null)
    {
    let reqObj = {
      'createdBy': this.commonData.uname,
      'modifiedBy': this.commonData.uname,
      'smsParameterName': form_values.parameter,
      'smsParameterType': form_values.value.smsParameterType,
      'smsParameterID': form_values.value.smsParameterID,
      'smsParameterValue': form_values.value.smsParameterName
    }
   
    if (reqObj.smsParameterName !== undefined && reqObj.smsParameterName !== null &&
      reqObj.smsParameterType !== undefined && reqObj.smsParameterType !== null &&
      reqObj.smsParameterID !== undefined && reqObj.smsParameterID !== null) {
      this.smsParameterMaps.push(reqObj);

      if(form_values.parameter !== null && form_values.parameter !== undefined && form_values.parameter !== "")
      {
          this.Parameters.splice(this.Parameters.indexOf(form_values.parameter), 1);
      }
    } else {
      this.commonDialogService.alert(this.currentLanguageSet.parameterValueTypeAndValueShouldBeSelected, 'info');
      if(form_values.parameter !== null && form_values.parameter !== undefined && form_values.parameter !== "")
     {
      this.Parameters.splice(this.Parameters.indexOf(form_values.parameter), 1);
      this.Parameters.push(form_values.parameter);
     }
     this.getSMSparameters();
    }

    // removing of the parameters pushed into buffer from the Parameters array and resetting of next two dropdowns
    this.smsParameters = [];
    this.selectedParameterValues = [];
  
  //  if (this.smsParameterMaps.length === 0 && form_values.parameter !== null && form_values.parameter !== undefined  && form_values.parameter !== "") {
  //   this.Parameters.push(form_values.parameter);
  //   this.getSMSparameters();
  //  }
   this.smsForm.value.parameter = null;
   if(this.smsForm.value.value !== "" && this.smsForm.value.value !== null && this.smsForm.value.value !== undefined){
    this.smsForm.value.value.smsParameterType = null;
    this.smsForm.value.value.smsParameterName = null;
    }
  }
  else {
    this.commonDialogService.alert(this.currentLanguageSet.parameterValueTypeAndValueShouldBeSelected, 'info');
  }
  }

  remove(obj, index) {
    this.smsParameterMaps.splice(index, 1);

    // putting back the respective Parameter if is row is deleted from buffer array
    this.Parameters.push(obj.smsParameterName);
    this.smsParameters = [];
    this.selectedParameterValues = [];
    this.smsForm.value.parameter = null;
    this.smsForm.value.value.smsParameterType = null;
    this.smsForm.value.value.smsParameterName = null;
    this.getSMSparameters();
  }

  saveSMStemplate(form_values) {
    let requestObject = {
      'createdBy': this.commonData.uname,
      'providerServiceMapID': this.providerServiceMapID,
      'smsParameterMaps': this.smsParameterMaps,
      'smsTemplate': (form_values !=undefined && form_values !=null && form_values.smsTemplate !=undefined && form_values.smsTemplate !=null) ? form_values.smsTemplate.trim() :null,
      'smsTemplateName': (form_values !=undefined && form_values !=null && form_values.templateName !=undefined && form_values.templateName !=null) ? form_values.templateName.trim() :null,
      'smsTypeID': form_values.smsType
    }

    console.log('Save Request', requestObject);

    this.sms_service.saveSMStemplate(requestObject)
      .subscribe(res => {
        this.commonDialogService.alert(this.currentLanguageSet.templateSavedSuccessfully, 'success');
        this.showTable();
      }, err => {
        this.commonDialogService.alert(err.errorMessage, 'error');
      });
  }

  view(object) {
    console.log('templateID', object);

    this.sms_service.getFullSMSTemplate(object.providerServiceMapID, object.smsTemplateID)
      .subscribe(response => {
        console.log(response, 'getfullSMStemplate success');
        this.viewSMSparameterTable = response.smsParameterMaps;
        this.viewTemplate = true;
        this.showTableFlag = false;

        this.viewform.form.patchValue({
          'templateName': response.smsTemplateName,
          'smsType': response.smsType.smsType,
          'smsTemplate': response.smsTemplate
        });

      }, err => {
        console.log(err, 'getfullSMStemplate error');
      })

  }
}
