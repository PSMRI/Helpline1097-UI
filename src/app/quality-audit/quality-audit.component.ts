import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality-audit',
  templateUrl: './quality-audit.component.html',
  styleUrls: ['./quality-audit.component.css']
})
export class QualityAuditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showSearchPanel:boolean=true;
  findRecordings()
  {
  	this.showSearchPanel=false;
  }

  refineSearch()
  {
  	this.showSearchPanel=true;
  }

  play()
  {
  	confirm("WINDOWS MEDIA PLAYER");
  }

  saveRatings()
  {
  	alert('Give your remarks/ratings in a modal window some days later... WORK IN PROGRESS');
  }

}
