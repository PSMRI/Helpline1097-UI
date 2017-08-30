import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-dial-beneficiary',
  templateUrl: './dial-beneficiary.component.html',
  styleUrls: [ './dial-beneficiary.component.css' ]
} )
export class DialBeneficiaryComponent implements OnInit
{

  constructor() { }

  ngOnInit ()
  {
  }

  resultsFound: boolean = false;
  phoneNumber: number;
  findBenByPh ()
  {
    this.resultsFound = true;
  }
}
