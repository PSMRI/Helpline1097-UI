import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

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

  deleted = false;
  showParameters = false;

  SMS_Types = [];

  Parameters = [];

  smsParameters = [];
  selectedParameterType;
  selectedParameterValues = [];

  smsParameterMaps = [];

  @ViewChild('smsForm') Smsform1: NgForm;
  // @ViewChild('smsForm2') Smsform2: NgForm;


  constructor(public commonData: dataService,
    public sms_service: SmsTemplateService,
    public commonDialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonData.current_service.serviceID; // check for each module
    this.serviceID = this.commonData.current_serviceID; // check for each module
    this.getSMStemplates(this.providerServiceMapID);
  }

  getSMStemplates(providerServiceMapID) {
    this.sms_service.getSMStemplates(providerServiceMapID)
      .subscribe(response => {
        if (response != undefined && response.length >= 0) {
          this.existing_templates = response;
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

        if (this.SMS_Types.length == 0) {
          this.SMS_Types = [
            {
              "smsTypeID": 2,
              "smsType": "Registration SMS",
              "description": "SMS sent with registration",
              "serviceID": 3,
              "deleted": false
            }
          ]
        }
      }, err => {
        console.log(err, 'error while fetching sms types');
        this.commonDialogService.alert(err.errorMessage, 'error');
      })
  }

  showTable() {
    this.showTableFlag = true;
    this.cancel();
  }

  ActivateDeactivate(flag) {
    this.deleted = flag;
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

    if (this.Parameters.length > 0) {
      this.showParameters = true;
      this.getSMSparameters();
    } else {
      this.commonDialogService.alert('No parameters identified in sms template', 'info');
    }
  }


  getSMSparameters() {
    this.sms_service.getSMSparameters()
      .subscribe(response => {
        this.smsParameters = response;
      }, err => {
        console.log(err, 'error while fetching sms parameters');
      })
  }

  setValuesInDropdown(parameter_object) {
    this.selectedParameterType = parameter_object.smsParameterType;
    this.selectedParameterValues = parameter_object.smsParameters;
  }

  cancel() {
    this.showParameters = false;
    this.smsParameterMaps = [];
  }

  add(form_values) {
    let reqObj = {
      'createdBy': this.commonData.uname,
      'modifiedBy': this.commonData.uname,
      'smsParamaterName': form_values.parameter,
      'smsParamaterType': form_values.value.smsParameterType,
      'smsParameterID': form_values.value.smsParameterID,
      'smsParameterValue': form_values.value.smsParameterName
    }
    this.smsParameterMaps.push(reqObj);
  }

  remove(index) {
    this.smsParameterMaps.splice(index, 1);
  }

  saveSMStemplate(form_values) {
    let requestObject = {
      'createdBy': this.commonData.uname,
      'providerServiceMapID': this.providerServiceMapID,
      'smsParameterMaps': this.smsParameterMaps,
      'smsTemplate': form_values.smsTemplate,
      'smsTemplateName': form_values.templateName,
      'smsTypeID': form_values.smsType
    }

    console.log('Save Request', requestObject);
  }
}
