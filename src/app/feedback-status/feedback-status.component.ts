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
  constructor(public dialogRef: MdDialogRef<FeedbackStatusComponent>,
    @Inject(MD_DIALOG_DATA) public feedbackStatusData: any, private renderer: Renderer) { }

  ngOnInit() {
    this.isCollapsedResponse = true;
    const feedbackStatusData = this.feedbackStatusData;
    console.log('Feed back data is', feedbackStatusData);
    this.feedBackRequests = this.feedbackStatusData[0].feedbackRequests;
    console.log('Feed back request data', this.feedBackRequests);
    this.feedBackResponses = this.feedbackStatusData[0].feedbackResponses;
    console.log('feed back response data', this.feedBackResponses);
    this.totalRecord = this.feedBackRequests.length;

  }
  showResponse(data: any) {
    console.log('Corresponding data is', data.target);
    this.isCollapsedResponse = !this.isCollapsedResponse;
    console.log('Tr data is', this.trChild.nativeElement.parent);
    // this.renderer.setElementAttribute(this.trChild.nativeElement, 'collapse', 'isCollapsedResponse');
  }


}
