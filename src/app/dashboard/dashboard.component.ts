import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { dataService } from '../services/dataService/data.service';

@Component( {
  selector: 'dashboard-component',
  templateUrl: './dashboard.html'
} )

export class dashboardContentClass implements OnInit
{
  barMinimized: boolean = true;
  eventSpiltData: any;
  data: any;
  constructor(
    public dataSettingService: dataService,
    public router: Router
  ) { };
  ngOnInit ()
  {
    this.showDashboard();
  }
  showDashboard ()
  {
    this.data = this.dataSettingService.Userdata;
    this.addListener();
  }
  toggleBar ()
  {
    if ( this.barMinimized )
      this.barMinimized = false;
    else
      this.barMinimized = true;
  }
  minimizeBar ()
  {
    this.barMinimized = true;
    this.testEvent();
  }

  // testing event
  testEvent ()
  {
    //var event = new Event('message');   

    let event = new CustomEvent( "message", {
      detail: {
        data: 'Accept|1234567890|1489742008.5180000000|INBOUND',
        time: new Date(),
      },
      bubbles: true,
      cancelable: true
    } );

    document.dispatchEvent( event );


  }

  listener ( event )
  {
    console.log( "listener invoked: " + event );
    // spliting test event 
    this.eventSpiltData = event.detail.data.split( '|' );
    // spliting czntrix event
    //this.eventSpiltData = event.data.split('|'); 

    this.handleEvent();
  }

  handleEvent ()
  {
    this.router.navigate( [ '/InnerpageComponent', this.eventSpiltData[ 1 ] ] );
  }

  addListener ()
  {


    if ( window.parent.parent.addEventListener )
    {

      console.log( "adding message listener" );
      document.addEventListener( "message", this.listener.bind( this ), false );
    }
    else
    {
      console.log( "adding onmessage listener" );
      //document.attachEvent("onmessage", this.listener) 
    }
  }
}
