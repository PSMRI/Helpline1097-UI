import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer } from '@angular/core';
// md2 components
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { CollapseDirective } from './../directives/collapse/collapse.directive'
declare var jQuery: any;
@Component({
  selector: 'app-feedback-status',
  templateUrl: './feedback-status.component.html',
  styleUrls: ['./feedback-status.component.css']
})

export class FeedbackStatusComponent implements OnInit {
  @ViewChild('tr') trChild: ElementRef;
  public feedBackRequests: any;
  public feedBackResponses: any;
  public isCollapsedResponse = false;
  totalRecord;
  consolidatedRequests: any;
  constructor(public dialogRef: MdDialogRef<FeedbackStatusComponent>,
    @Inject(MD_DIALOG_DATA) public feedbackStatusData: any, private renderer: Renderer) { }

  ngOnInit() {
    this.isCollapsedResponse = true;
    const feedbackStatusData = this.feedbackStatusData;
    let dataLength = feedbackStatusData.length;
    console.log('Feed back data is', feedbackStatusData);
    this.feedBackRequests = this.feedbackStatusData[dataLength - 1].feedbackRequests;
    console.log('Feed back request data', this.feedBackRequests);
    this.feedBackResponses = this.feedbackStatusData[dataLength - 1].feedbackResponses;
    console.log('feed back response data', this.feedBackResponses);
    this.totalRecord = this.feedBackRequests.length;
    this.consolidatedRequests = this.feedbackStatusData[dataLength - 1].consolidatedRequests;

  }
  showResponse(data: any) {
    console.log('Corresponding data is', data.target);
    this.isCollapsedResponse = !this.isCollapsedResponse;
    console.log('Tr data is', this.trChild.nativeElement.parent);
    // this.renderer.setElementAttribute(this.trChild.nativeElement, 'collapse', 'isCollapsedResponse');
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

}
