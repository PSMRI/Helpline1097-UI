import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
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

	@Output() updateClosureData: EventEmitter<any> = new EventEmitter<any>();
	@Output() serviceProvided: EventEmitter<any> = new EventEmitter<any>();
	@Output() StartNewCall: EventEmitter<any> = new EventEmitter<any>();
	@Output() ReloadCall: EventEmitter<any> = new EventEmitter<any>();
	@Output() beneficiarySelected: EventEmitter<any> = new EventEmitter<any>();

	constructor( public getCommonData: dataService, public router: Router )
	{
		setInterval(() =>
		{
			this.callDuration = this.callDuration + 1;
		}, 1000 );
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
		var idx = jQuery( '.carousel-inner div.active' ).index();
		console.log( "index", idx );

		jQuery( '#closureLink' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx + 3 );
			jQuery( "#four" ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( "#four" ).find( "a" ).addClass( "active-tab" );
		} );
		jQuery( '#cancelLink' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx );
			jQuery( "#one" ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( "#one" ).find( "a" ).addClass( "active-tab" );
		} );



		jQuery( '#one' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx );
			jQuery( this ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( this ).find( "a" ).addClass( "active-tab" );
		} );
		jQuery( '#two' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx + 1 );
			jQuery( this ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( this ).find( "a" ).addClass( "active-tab" );
		} );
		jQuery( '#three' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx + 2 );
			jQuery( this ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( this ).find( "a" ).addClass( "active-tab" );
		} );
		jQuery( '#four' ).on( 'click', function () 
		{
			jQuery( '#myCarousel' ).carousel( idx + 3 );
			jQuery( this ).parent().find( "a" ).removeClass( 'active-tab' );
			jQuery( this ).find( "a" ).addClass( "active-tab" );
		} );

		jQuery( "#previous" ).on( 'click', function ()
		{
			var idx = jQuery( '.carousel-inner div.active' ).index();
			console.log( 'chala with', idx );
			if ( idx === 0 )
			{
				console.log( 'chala' )
				jQuery( "#one" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#one" ).find( "a" ).addClass( "active-tab" );
			}
			if ( idx === 1 )
			{
				jQuery( "#two" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#two" ).find( "a" ).addClass( "active-tab" );
			}
			if ( idx === 2 )
			{
				jQuery( "#three" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#three" ).find( "a" ).addClass( "active-tab" );
			}
			if ( idx === 3 )
			{

				jQuery( "#four" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#four" ).find( "a" ).addClass( "active-tab" );
			}
		} );


		jQuery( "#next" ).on( 'click', function ()
		{

			var idx = jQuery( '.carousel-inner div.active' ).index();
			console.log( 'chala with', idx );
			if ( idx === 0 )
			{
				jQuery( "#one" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#one" ).find( "a" ).addClass( "active-tab" );
			}
			if ( idx === 1 )
			{
				jQuery( "#two" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#two" ).find( "a" ).addClass( "active-tab" );

			}
			if ( idx === 2 )
			{
				jQuery( "#three" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#three" ).find( "a" ).addClass( "active-tab" );

			}
			if ( idx === 3 )
			{
				jQuery( "#four" ).parent().find( "a" ).removeClass( 'active-tab' );
				jQuery( "#four" ).find( "a" ).addClass( "active-tab" );
			}
		} );
		// this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': [''] } }]);
	}

	addActiveClass ( val: any )
	{
		jQuery( '#' + val ).parent().find( "a" ).removeClass( 'active-tab' );
		jQuery( '#' + val ).find( "a" ).addClass( "active-tab" );
	}

	getSelectedBenDetails ( data: any )
	{
		console.log( 'data recieved', data, data.beneficiaryRegID );
		this.beneficiaryNotSelected = false;
		this.updateClosureData.emit();
		this.serviceProvided.emit();
		this.beneficiarySelected.emit();
		this.selectedBenData.id = "BEN" + data.beneficiaryRegID;
		this.selectedBenData.fname = data.firstName;
		this.selectedBenData.lname = data.lastName;
		this.selectedBenData.mob = data.phoneNo;
	}

	@Input()
	startNewCall ()
	{
		this.StartNewCall.emit();
		document.getElementById( "cancelLink" ).click();
	}
	reloadCall ()
	{
		this.ReloadCall.emit();
	}

	refreshCall ()
	{

	}

	updateServiceProvided ()
	{
		this.serviceProvided.emit( null );
	}
	// 	change(no:any){

	// if (no === '1') {

	// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['registerBeneficiary'] } }]);
	// }
	// if (no === '2') {
	// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['servicesForBeneficiary'] } }]);
	// }
	// if (no === '3') {
	// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['updates'] } }]);
	// }
	// if (no === '4') {
	// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['closure'] } }]);
	//    }

	// 	}


}
