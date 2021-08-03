import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { LocationService } from '../services/common/location.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-sexual-orientation-report',
  templateUrl: './sexual-orientation-report.component.html',
  styleUrls: ['./sexual-orientation-report.component.css']
})
export class SexualOrientationReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  maxStartDate: Date;
  maxEndDate: Date;
  tableFlag: boolean = false;
  data = [];
  sexualOrientations = [];
  providerServiceMapID: any;
  @ViewChild('sexualOrientationSearchForm') sexualOrientationSearchForm: NgForm;
  postData: any = [];
  orientations = [];
  states = [];
  districts = [];
  sexualOrientation: any;
  state: any;
  district: any;
  currentLanguageSet: any;


  constructor(private dataService: dataService, private userbeneficiarydata: UserBeneficiaryData,
    private reportsService: ReportsService, private alertService: ConfirmationDialogsService,
    private locationService: LocationService,public httpServices:HttpServices
    ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata.getUserBeneficaryData(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.sexualOrientations = response['sexualOrientations'];
        let all = {
          "sexualOrientation": "All"
        }
        this.sexualOrientations.push(all);
        this.states = response['states'];
      },
      (error) => {
        this.alertService.alert(error.errorMessage, 'error');

        console.log(error);
      })

    this.providerServiceMapID = this.dataService.current_service.serviceID;

    this.today = new Date();
    // this.end_date = new Date();
    // this.end_date.setDate(this.today.getDate() - 1);
    // this.end_date.setHours(23, 59, 59, 0);

    // this.start_date = new Date();
    // this.start_date.setDate(this.today.getDate() - 7);
    // this.start_date.setHours(0, 0, 0, 0);

    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate()-1);
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate()-1);
    this.maxEndDate.setHours(23, 59, 59, 0);

 
    


    //console.log("sd,ed,msd,med", this.start_date, this.end_date, this.maxStartDate, this.maxEndDate);
    //this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  getDistricts() {
    this.districts = [];
    this.sexualOrientationSearchForm.form.patchValue({
      'district': ''
    });
    this.locationService.getDistricts(this.sexualOrientationSearchForm.value.state.stateID)
      .subscribe((response) => {
        this.districts = response;
      },
      (error) => {
        this.alertService.alert(error.errorMessage, 'error');

        console.log(error);
      })
    console.log(this.sexualOrientations);
  }

  // endDateChange(){
  //   console.log(this.end_date);
  //   // this.minStartDate = new Date(this.end_date);
  //   // this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
  //   // this.start_date = new Date(this.end_date);
  //   // this.start_date.setMonth(this.start_date.getMonth()-1);
  // }

  endDateChange() {

 
    const timeDiff = this.maxEndDate.getTime() - this.start_date.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays>=0)
    {
     if (diffDays >= 30) {
      this.maxEndDate = new Date(this.start_date);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 29);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxEndDate;
     }
     if (diffDays < 30) {
      const endDateDiff =  this.today.getTime() - this.maxEndDate.getTime();
      const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
      if (enddiffDays >= 30) {
        this.maxEndDate = new Date(this.start_date);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 29);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.end_date = this.maxEndDate;
      } 
      else{
      this.maxEndDate = new Date();
      this.maxEndDate.setDate(this.today.getDate()-1);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxEndDate;

      }
     }
   }
   else
   {
    const endDateDiff =  this.today.getTime() - this.start_date.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
 
    if(enddiffDays>=30)
    {
    this.maxEndDate = new Date(this.start_date);
    this.maxEndDate.setDate(this.maxEndDate.getDate() + 29);
    this.maxEndDate.setHours(23, 59, 59, 0);
    this.end_date = this.maxEndDate;
    }
    else
    {
      this.maxEndDate = new Date();
      this.maxEndDate.setDate(this.today.getDate()-1);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxEndDate;
    }
   }
    //console.log("sd,med", this.start_date, this.maxEndDate);
    // if (this.today.getTime() < this.maxEndDate.getTime()) {
    //   let i = new Date();
    //   i.setDate(this.today.getDate() - 1);
    //   this.maxEndDate = i;
    //   this.maxEndDate.setHours(23, 59, 59, 0);
      //console.log("sd,med", this.start_date, this.maxEndDate);
    // }
    // else {
    //   this.maxEndDate = new Date(this.start_date);
    //   this.maxEndDate.setMonth(this.maxEndDate.getMonth() + 1);
    //   this.maxEndDate.setHours(23, 59, 59, 0);
    // }

    // var timeDiff = this.end_date.getTime() - this.start_date.getTime();
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // if (diffDays > 90) {
    //   var tempDate = new Date(this.start_date);
    //   tempDate.setMonth(this.start_date.getMonth() + 1);
    //   tempDate.setHours(23, 59, 59, 0);
    //   this.sexualOrientationSearchForm.form.patchValue({
    //     'endDate': tempDate
    //   });
    // }
    // if (diffDays < 0) {
    //   var tempDate = new Date(this.start_date);
    //   tempDate.setHours(23, 59, 59, 0);
    //   this.sexualOrientationSearchForm.form.patchValue({
    //     'endDate': tempDate
    //   });
    // }
  }



  getReports() {
    console.log("values:", this.sexualOrientationSearchForm.value);
    this.postData = [];
    if (this.sexualOrientationSearchForm.value.sexuality == "All") {
      for (var i = 0; i < this.sexualOrientations.length - 1; i++) {
        var obj = {
          "providerServiceMapID": this.providerServiceMapID,
          "startTimestamp": new Date((this.sexualOrientationSearchForm.value.startDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
          "endTimestamp": new Date((this.sexualOrientationSearchForm.value.endDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
          "beneficiarySexualOrientation": this.sexualOrientations[i].sexualOrientation
        }
        if (this.sexualOrientationSearchForm.value.state != '') {
          obj['state'] = this.sexualOrientationSearchForm.value.state.stateName;
        }
        if (this.sexualOrientationSearchForm.value.district != '') {
          obj['district'] = this.sexualOrientationSearchForm.value.district;
        }
        this.postData.push(obj);
      }

    }
    else {
      //  for(var i=0; i< this.sexualOrientationSearchForm.value.sexuality.length;i++){

      var obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "startTimestamp": new Date((this.sexualOrientationSearchForm.value.startDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.startDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T00:00:00.000Z",
        "endTimestamp": new Date((this.sexualOrientationSearchForm.value.endDate.getTime() - 1 * (this.sexualOrientationSearchForm.value.endDate.getTimezoneOffset() * 60 * 1000))).toJSON().slice(0, 10) + "T23:59:59.999Z",
        "beneficiarySexualOrientation": this.sexualOrientationSearchForm.value.sexuality
      }
      if (this.sexualOrientationSearchForm.value.state != '') {
        obj['state'] = this.sexualOrientationSearchForm.value.state.stateName;
      }
      if (this.sexualOrientationSearchForm.value.district != '') {
        obj['district'] = this.sexualOrientationSearchForm.value.district;
      }
      this.postData.push(obj);
      //  }

    }
    this.sexualOrientation = this.sexualOrientationSearchForm.value.sexuality;
    this.state = this.sexualOrientationSearchForm.value.state.stateName ? this.sexualOrientationSearchForm.value.state.stateName : 'Any';
    this.district = this.sexualOrientationSearchForm.value.district ? this.sexualOrientationSearchForm.value.district : 'Any';
    this.start_date = this.sexualOrientationSearchForm.value.startDate;
    this.end_date = this.sexualOrientationSearchForm.value.endDate;
    console.log(this.postData);
    this.reportsService.getAllBySexualOrientation(this.postData)
      .subscribe((response) => {
        console.log(response);
        this.tableFlag = true;
        this.orientations = response;

      },
      (error) => {
        this.alertService.alert(error.errorMessage, 'error');

        console.log(error);
      })
  }

  download_report() {
    var head = Object.keys(this.orientations[0]);
    new Angular2Csv(this.orientations, 'Sexual Orientation Report', { headers: (head) });

    this.alertService.alert(this.currentLanguageSet.sexualOrientationReportDownloaded, 'success');

  }
  downloadV2() {
    let criteria: any = [];
    // let state = this.sexualOrientationSearchForm.value.state.stateName ? this.sexualOrientationSearchForm.value.state.stateName : 'Any';
    // let district = this.sexualOrientationSearchForm.value.district ? this.sexualOrientationSearchForm.value.district : 'Any';
    criteria.push({ 'Filter_Name': 'State', 'value': this.state });
    criteria.push({ 'Filter_Name': 'District', 'value': this.district });
    criteria.push({ 'Filter_Name': 'Sexual_Orientation', 'value': this.sexualOrientation });
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': this.start_date });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': this.end_date });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = ["SlNo", "sexualOrientation", "serviceProvidedRatio", "count"]
    let wb_name = "Sexual Orientation Report";
    const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.orientations, { header: headers });

    // below code added to modify the headers ---XXXXXXXXXXXXXX----- 5/7/18 gursimran

    let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
    let count = 0;
    while (i < headers.length + 65) {
      let j;
      if (count > 0) {
        j = i - (26 * count);
      }
      else {
        j = i;
      }
      let cellPosition = String.fromCharCode(j);
      let finalCellName: any;
      if (count == 0) {
        finalCellName = cellPosition + "1";
        // console.log(finalCellName);
      }
      else {
        let newcellPosition = String.fromCharCode(64 + count);
        finalCellName = newcellPosition + cellPosition + "1";
        // console.log(finalCellName);
      }
      let newName = this.modifyHeader(headers, i);
      delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
      i++;
      if (i == 91 + (count * 26)) {
        // i = 65;
        count++;
      }
    }
    // --------end--------

    const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
    let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, wb_name);
    }
    else {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = wb_name.replace(/ /g, "_") + ".xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65].toString().replace(/([A-Z])/g, ' $1').trim();
    modifiedHeader = modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
  }
  resetWorklist(){
  this.orientations=[];
  this.tableFlag = false;
  }
}
