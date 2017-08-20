import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router'
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
    public router: ActivatedRoute

  ) {
    // setInterval(() =>
    // {
    // 	this.callDuration = this.callDuration + 1;
    // }, 1000 );

  }

  data: any = this.getCommonData.Userdata;


  /*<td>{{regHistory.beneficiaryID}}</td>
                <td>{{regHistory.firstName}} {{regHistory.middleName}} {{regHistory.lastName}}</td>
                <td>{{regHistory.dOB|date:'dd-MM-yyyy'}}</td>
                <td>{{regHistory.age}}</td>
                <td>{{regHistory.m_gender.genderName}}</td>
                <td>{{regHistory.i_bendemographics.m_state.stateName}}</td>
                <td>{{regHistory.i_bendemographics.m_district.districtName}}</td>
                <td>{{regHistory.i_bendemographics.m_districtblock.blockName}}</td>
                <td>{{regHistory.i_bendemographics.m_districtbranchmapping.villageName}}</td>
                <td>{{regHistory.i_bendemographics.m_language.languageName}}</td>
                <td>{{regHistory.benPhoneMaps[0].benRelationshipType.benRelationshipType}}</td>
                */
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
    jQuery('#' + val).parent().find("a").removeClass('active-tab');
    jQuery('#' + val).find('a').addClass('active-tab');
  }

  getSelectedBenDetails(data: any) {
    debugger;
    if (data != null) {
      this.selectedBenData.id = 'Ben ID: ' + data.beneficiaryRegID;
      this.selectedBenData.fname = data.firstName;
      this.selectedBenData.lname = data.lastName;
      this.selectedBenData.name = 'Name: ' + data.firstName + ' ' + data.lastName;
      // if ( data.dOB )
      // {
      // 	let currDate = new Date();
      // 	let dob = new Date( data.dOB );
      // 	let age = new Date( currDate.getTime() - dob.getTime() ).getFullYear() - this.startYear;
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
}
