import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';


@Component({
    selector: 'activity-this-week',
    templateUrl: './activity-this-week.component.html',
})
export class ActivityThisWeekComponent implements OnInit {
    role: any;
    campaign: any;
    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        // this.campaign = this.getCommonData.current_campaign;
        // console.log("Current campaign "+this.getCommonData.current_campaign);

    };
    constructor(public getCommonData: dataService) {
        this.role = this.getCommonData.current_role.RoleName;
        this.campaign = this.getCommonData.current_campaign;
        // this.campaign = this.getCommonData.current_campaign;
        // console.log('Current campaign ' + this.getCommonData.current_campaign);

    }

    close() {
        this.hide_component.emit('1');
    };

}