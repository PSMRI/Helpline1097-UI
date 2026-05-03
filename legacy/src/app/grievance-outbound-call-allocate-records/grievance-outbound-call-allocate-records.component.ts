import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OutboundCallAllocationService } from '../services/outboundServices/outbound-call-allocation.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-grievance-outbound-call-allocate-records',
  templateUrl: './grievance-outbound-call-allocate-records.component.html',
  styleUrls: ['./grievance-outbound-call-allocate-records.component.css']
})
export class GrievanceOutboundCallAllocateRecordsComponent implements OnInit {
  users: any = [];
  touserID: any;
  roleID: any;
  allocateNo: any;
  roles: any = [];
  providerServiceMapID: number;
  @Input() outboundCallRequests: any;
  afterAllocate: boolean = true;
  allocateForm: FormGroup;
  showAgents: boolean = false;
  @Output() outboundCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() filterAgent: any = '';
  @Input() reallocationFlag: boolean = false;
  @Output() refreshScreen: EventEmitter<any> = new EventEmitter<any>();
  initialCount: number;
  @ViewChild('allocateRef') input: ElementRef;
  selectedLanguage: any;
  currentLanguageSet: any;

  constructor(
    private outboundCallAllocationService: OutboundCallAllocationService,
    private savedData: dataService,
    private alertMessage: ConfirmationDialogsService,
    private fb: FormBuilder,
    private outboundSearchRecordService: OutboundSearchRecordService,
    private renderer: Renderer,
    public httpServices: HttpServices
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.savedData.current_service.serviceID;
    this.getRoles();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  createForm() {
    this.allocateForm = this.fb.group({
      roleID: ['', Validators.required],
      touserID: ['', Validators.required],
      allocateNo: ['', Validators.required]
    });
  }
  getRoles() {
    this.outboundCallAllocationService.getRolesbyProviderID(this.providerServiceMapID)
      .subscribe(response => {
        this.roles = response.filter((item) => {
          return item.roleName && item.roleName.toLowerCase() !== 'supervisor' && item.roleName.toLowerCase() !== 'provideradmin';
        })
      }, (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');

      });
  }
  getAgents(roleID: any) {
    this.users = [];
    this.allocateForm.controls["touserID"].patchValue([]);
    this.allocateForm.controls["allocateNo"].patchValue(this.outboundCallRequests.noOfRecords);
    let languageName = null;
    if (this.outboundCallRequests && this.outboundCallRequests.langaugeName) {
      languageName = this.outboundCallRequests.langaugeName.langName;
    }
    this.outboundCallAllocationService.getAgentsbyRoleID(this.providerServiceMapID, roleID, languageName)
      .subscribe(resProviderData => {
        if (resProviderData && resProviderData.length > 0) {
          this.users = resProviderData;
          if (this.filterAgent && this.filterAgent.agentName) {
            this.users = this.users.filter((obj) => {
              return (obj.firstName + " " + obj.lastName) !== this.filterAgent.agentName;
            });
            if (this.users.length > 0) {
              this.showAgents = false;
            }
            else {
              this.showAgents = true;
            }
          }
        }
        else {
          this.showAgents = true;
        }
      }, (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }

  getAgentsbyLanguageName(roleID: any, languageName) {
    this.outboundCallAllocationService.getAgentsbyRoleID(this.providerServiceMapID, roleID, languageName)
      .subscribe(resProviderData => {
        this.users = resProviderData;
        if (this.filterAgent) {
          this.users = this.users.filter((obj) => {
            return (obj.firstName + " " + obj.lastName) !== this.filterAgent.agentName;
          })
        }
      }, (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }

  ngOnChanges() {
    this.providerServiceMapID = this.savedData.current_service.serviceID;
    this.allocateForm.reset();
    this.users = [];
    this.showAgents = false;
    this.getUnallocateCall(this.providerServiceMapID, this.outboundCallRequests);
    this.afterAllocate = true;
    this.allocateForm.patchValue({
      touserID: []
    });
    if (this.reallocationFlag) {
      this.selectedLanguage = this.filterAgent.languageName;
      this.allocateForm.controls['roleID'].setValue(this.filterAgent.roleID);
      this.providerServiceMapID = this.savedData.current_service.serviceID;
      this.getAgentsbyLanguageName(this.filterAgent.roleID, this.filterAgent.languageName);
    }
  }

  onCreate() {
    const requestObject = {
      startDate: this.outboundCallRequests.startDate,
      endDate: this.outboundCallRequests.endDate,
      providerServiceMapId: this.providerServiceMapID,
      language: this.outboundCallRequests.langaugeName.langName,
      fromUserId: this.outboundCallRequests.assignedUserID,
      ...this.allocateForm.value
    };
    let isAllocate = this.outboundCallRequests.isAllocate;
    this.outboundCallAllocationService.allocateGrievanceCallsToAgents(requestObject, isAllocate)
      .subscribe(
      (response) => {
        if(response) {
        this.alertMessage.alert(this.currentLanguageSet.callAllocatedSuccessfully, 'success');
        this.afterAllocate = false;
        let obj = {};
        obj['startDate'] = this.outboundCallRequests.startDate;
        obj['endDate'] = this.outboundCallRequests.endDate;
        obj['providerServiceMapId'] = this.providerServiceMapID;
        this.outboundCount.emit(obj);
        this.refreshScreen.emit();
      }
      },
      (error) => {
        this.alertMessage.alert(error.status, 'error');
      });
  }

  blockKey(e: any) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8 || e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  validate(event) {

    let selectedNoOfRecords = event.target.value;
     if (selectedNoOfRecords > this.initialCount || selectedNoOfRecords < 1) {
      this.allocateForm.controls["allocateNo"].patchValue(0);
    }
  }

  onSelectChange() {
    let outboundlistCount = this.outboundCallRequests.noOfRecords;

    if(this.allocateForm.value.touserID && this.allocateForm.value.touserID.length > 0) {
    let tempValue = Math.floor(outboundlistCount / this.allocateForm.value.touserID.length);
    this.initialCount = tempValue;
    this.allocateForm.patchValue({
      allocateNo: tempValue
    });
  }
  else {
    this.allocateForm.patchValue({
      allocateNo: outboundlistCount
    });
  }

  }
 
  getUnallocateCall(serviceProviderMapId, value) {
    let startDate: Date = new Date(value.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    let endDate: Date = new Date(value.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    this.initialCount = this.outboundCallRequests.noOfRecords;
    this.allocateForm.controls["allocateNo"].patchValue(this.initialCount);
  }
}
