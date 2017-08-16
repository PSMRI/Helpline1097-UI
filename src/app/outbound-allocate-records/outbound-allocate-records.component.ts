import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundCallAllocationService } from '../services/outboundServices/outbound-call-allocation.service';
import { dataService } from '../services/dataService/data.service';


@Component( {
	selector: 'app-outbound-allocate-records',
	templateUrl: './outbound-allocate-records.component.html',
	styleUrls: [ './outbound-allocate-records.component.css' ],
	//providers:[]
} )

export class OutboundAllocateRecordsComponent implements OnInit
{
	public showCreateFlag = false;
	serviceProviders: string[];
	data: any;
	totalNewRecords: any;
	totalRecords: any;
	AllocateNoOfRecords: any;
	users: any;
	userID: any;
	savedRes: any;
	allocateNo: any;
	providerServiceMapID: number;
	@Input() outboundCallRequests: any = [];
	@ViewChild( 'allocateForm' ) allocateForm: NgForm;
	initialCount: number;

	constructor(
		private _OCAService: OutboundCallAllocationService,
		private saved_data: dataService
	)
	{

	}


	outboundallocateform = new FormGroup( {

		totalNewRecords: new FormControl(),
		userID: new FormControl(),
		AllocateNoOfRecords: new FormControl()
	} );

	ngOnInit ()
	{
		this.providerServiceMapID = this.saved_data.current_service.serviceID;
		this._OCAService.getAgents( this.providerServiceMapID )
			.subscribe( resProviderData =>
			{
				console.log( "reading..." )
				this.users = resProviderData;
				console.log( "users: ", this.users );
			}
			);

		this.initialCount = this.outboundCallRequests.length;
	}

	ngOnChanges ()
	{
		this.initialCount = this.outboundCallRequests.length;
		this.allocateForm.form.patchValue( {
			userID: []
		} );
	}

	onCreate ( val: any )
	{
		console.log( "Request: " + JSON.stringify( this.allocateForm.value ) );
		this._OCAService.allocateCallsToAgenta( this.allocateForm.value )
			.subscribe(
			( response ) =>
			{
				console.log( response );
			},
			( error ) =>
			{
				console.log( error );
			}
			);
	}

	OnSelectChange ()
	{
		console.log( this.allocateForm.value );
		var tempValue = Math.ceil( this.outboundCallRequests.length / this.allocateForm.value.userID.length );
		this.allocateForm.form.patchValue( {
			allocateNo: tempValue
		} );
	}

}
