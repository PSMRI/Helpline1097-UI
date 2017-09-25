import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
@Component({
    selector: 'news-informations',
    templateUrl: './news-informations.component.html',
})
export class NewsInformationsComponent implements OnInit {
    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();


    ngOnInit() { };

    constructor() { };

    close() {
        this.hide_component.emit('5');
    }
}