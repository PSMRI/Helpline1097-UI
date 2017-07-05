import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router'
declare var jQuery: any;


@Component( {
	selector: 'app-innerpage',
	templateUrl: './innerpage.component.html',
	styleUrls: [ './innerpage.component.css' ]
} )
export class InnerpageComponent implements OnInit
{
	callDuration: number = 0;
	beneficiaryNotSelected: boolean = true;
	callerNumber: any;
	barMinimized: boolean = true;

	@Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
	@Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
	@Output() StartNewCall: EventEmitter<any> = new EventEmitter<any>();
	@Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
	@Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();
	current_service: any;

	constructor(
		public getCommonData: dataService,
		public basicrouter: Router,
		public router: ActivatedRoute

	)
	{
		// setInterval(() =>
		// {
		// 	this.callDuration = this.callDuration + 1;
		// }, 1000 );
	}

	data: any = this.getCommonData.Userdata;

	selectedBenData: any = {
		'id': '',
		'fname': '',
		'lname': '',
		'mob': ''
	};

	ngOnInit ()
	{
		this.current_service = this.getCommonData.current_service.serviceName;
	}
	addActiveClass ( val: any )
	{
		jQuery( '#' + val ).parent().find( "a" ).removeClass( 'active-tab' );
		jQuery( '#' + val ).find( "a" ).addClass( "active-tab" );
	}

	getSelectedBenDetails ( data: any )
	{
		if ( data != null )
		{
			this.selectedBenData.id = data.beneficiaryID;
			this.selectedBenData.fname = data.firstName;
			this.selectedBenData.lname = data.lastName;
		} else
		{
			this.selectedBenData.id = "";
			this.selectedBenData.fname = "";
			this.selectedBenData.lname = "";
		}
	}
}
