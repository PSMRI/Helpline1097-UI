import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'rating',
    templateUrl: './rating.component.html',
})
export class RatingComponent implements OnInit {
    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();


    ngOnInit() { };

    constructor() { };

    close() {
        this.hide_component.emit("2");
    }
}
