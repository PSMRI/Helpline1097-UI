import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router'

import { HttpServices } from '../services/http-services/http_services.service';

declare const jQuery: any;


@Component({
  selector: 'app-innerpage',
  templateUrl: './innerpage.component.html',
  styleUrls: ['./innerpage.component.css']
})
export class InnerpageComponent implements OnInit {
  callDuration: string = '';
  beneficiaryNotSelected: boolean = true;
  callerNumber: any;
  barMinimized: boolean = true;
  startYear: number = 1970;
  checkRole = true;
  seconds: number = 0;
  minutes: number = 0;
  counter: number = 0;
  current_campaign: any;

  // language change stuff
  languageFilePath: any = 'assets/language.json';
  selectedlanguage: any = '';
  currentlanguageSet: any = {};
  language_change: any;


  @Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
  @Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
  @Output() StartNewCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
  @Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
  current_service: any;
  current_role: any;

  constructor(
    public getCommonData: dataService,
    public basicrouter: Router,
    public router: ActivatedRoute,
    public HttpServices: HttpServices,
    public http: Http

  ) {
    this.currentlanguageSet = [];

  }

  data: any = this.getCommonData.Userdata;

  // tslint:disable-next-line:member-ordering
  selectedBenData: any = {
    'id': '',
    'fname': '',
    'lname': '',
    'mob': '',
    'age': '',
    'gender': '',
    'state': '',
    'district': '',
    'block': '',
    'village': '',
    'language': '',
    'relation': '',
    'name': ''
  };

  ngOnInit() {

    this.router.params.subscribe((params: Params) => {
      if (params['mobileNumber'] != undefined) {
        // tslint:disable-next-line:radix
        this.callerNumber = parseInt(params['mobileNumber']);
        console.log(' this.callerNumber:' + this.callerNumber);
        console.log(this.current_service + ':' + this.current_role);
      }
    });

    this.language_change = 'english';
    this.getLanguageObject(this.language_change);

    this.current_service = this.getCommonData.current_service.serviceName;
    this.current_role = this.getCommonData.current_role.RoleName;
    if (this.current_role.toLowerCase() === 'supervisior') {
      this.checkRole = false;
    }
    this.callDuration = this.minutes + 'm ' + this.seconds + 's ';
    setInterval(() => {
      // Get todays date and time
      if (this.seconds === (this.counter + 60)) {
        this.minutes = this.minutes + 1;
        this.seconds = 0;
      }
      this.seconds = this.seconds + 1;
      this.callDuration = this.minutes + 'm ' + this.seconds + 's ';
    }, 1000);
    this.current_campaign = this.getCommonData.current_campaign;
  }
  addActiveClass(val: any) {
    jQuery('#' + val).parent().find('a').removeClass('active-tab');
    jQuery('#' + val).find('a').addClass('active-tab');
  }

  getSelectedBenDetails(data: any) {
    if (data != null) {
      this.selectedBenData.id = 'Ben ID: ' + data.beneficiaryRegID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
      this.selectedBenData.name = 'Name: ' + data.firstName + ' ' + data.lastName;
      // if ( data.dOB )
      // {
      //  let currDate = new Date();
      //  let dob = new Date( data.dOB );
      //  let age = new Date( currDate.getTime() - dob.getTime() ).getFullYear() - this.startYear;
      this.selectedBenData.age = 'Age: ' + data.age;
      // }
      this.selectedBenData.gender = 'Gender: ' + data.m_gender.genderName;
      this.selectedBenData.state = 'State: ' + data.i_bendemographics.m_state.stateName;
      this.selectedBenData.district = 'District: ' + data.i_bendemographics.m_district.districtName;
      this.selectedBenData.block = 'Taluk: ' + data.i_bendemographics.m_districtblock.blockName;
      this.selectedBenData.village = 'Village: ' + data.i_bendemographics.m_districtbranchmapping.villageName;
      this.selectedBenData.language = 'Preferred Lang: ' + data.i_bendemographics.m_language.languageName;
      this.selectedBenData.relation = 'Family tagging: ' + data.benPhoneMaps[0].benRelationshipType.benRelationshipType;
    } else {
      this.selectedBenData.id = '';
      this.selectedBenData.fname = '';
      this.selectedBenData.lname = '';
      this.selectedBenData.age = '';
      this.selectedBenData.gender = '';
      this.selectedBenData.state = '';
      this.selectedBenData.district = '';
      this.selectedBenData.block = '';
      this.selectedBenData.village = '';
      this.selectedBenData.language = '';
      this.selectedBenData.relation = '';
    }
  }


  minimizeBar() {
    this.barMinimized = true;
  }
  toggleBar() {
    this.barMinimized = !this.barMinimized;

  }
  calculateTimeDuration() {

    // Update the count down every 1 secon

  }


  // language change stuff
  getLanguageObject(language) {
    this.selectedlanguage = language;
    console.log('language asked for is:', language);
    this.HttpServices.getData(this.languageFilePath).subscribe(response => this.successhandeler(response, language));

  }

  successhandeler(response, language) {
    console.log('language triggered and recieved', response, language);
    this.currentlanguageSet = response[language];
    // this.currentlanguageSet = "LANGUAGE IS ENGLISH PEHLI BAAR ME";
  }

}