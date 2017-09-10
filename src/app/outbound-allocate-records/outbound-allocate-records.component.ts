import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundCallAllocationService } from '../services/outboundServices/outbound-call-allocation.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';


@Component({
  selector: 'app-outbound-allocate-records',
  templateUrl: './outbound-allocate-records.component.html',
  styleUrls: ['./outbound-allocate-records.component.css'],
})

export class OutboundAllocateRecordsComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  totalNewRecords: any;
  totalRecords: any;
  AllocateNoOfRecords: any;
  users: any = [];
  userID: any;
  savedRes: any;
  allocateNo: any;
  roles: any = [];
  providerServiceMapID: number;
  @Input() outboundCallRequests: any = [];
  @ViewChild('allocateForm') allocateForm: NgForm;
  @Output() outboundCount: EventEmitter<any> = new EventEmitter<any>();
  initialCount: number;
  outboundallocateform = new FormGroup({
    totalNewRecords: new FormControl(),
    userID: new FormControl(),
    AllocateNoOfRecords: new FormControl(),
    roleID: new FormControl(),
  });

  constructor(
    private _OCAService: OutboundCallAllocationService,
    private saved_data: dataService,
    private alertMessage: ConfirmationDialogsService
  ) {

  }

  ngOnInit() {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;

    this.roles = this.saved_data.userPriveliges[0].roles;


    this.initialCount = this.outboundCallRequests.length;
  }
  getAgents() {
    this._OCAService.getAgents(this.providerServiceMapID)
      .subscribe(resProviderData => {
        console.log('reading...')
        this.users = resProviderData;
        console.log('users: ', this.users);
      }
      );

  }
  ngOnChanges() {
    this.initialCount = this.outboundCallRequests.length;
    this.allocateForm.form.patchValue({
      userID: []
    });
  }

  onCreate(val: any) {
    // this.outboundCallRequests.length = this.outboundCallRequests.length - val.allocateNo;
    console.log('Request: ' + JSON.stringify(this.allocateForm.value));
    this._OCAService.allocateCallsToAgenta(this.allocateForm.value)
      .subscribe(
      (response) => {
        this.alertMessage.alert('Sucessfully Allocated');
        //  this.outboundCount.emit(this.outboundCallRequests.length - val.allocateNo);
        console.log(response);
      },
      (error) => {
        this.alertMessage.alert(error.errorMessage);
        console.log(error);
      }
      );
  }

  OnSelectChange() {
    console.log(this.allocateForm.value);
    var tempValue = Math.ceil(this.outboundCallRequests.length / this.allocateForm.value.userID.length);
    this.allocateForm.form.patchValue({
      allocateNo: tempValue
    });
  }

}
