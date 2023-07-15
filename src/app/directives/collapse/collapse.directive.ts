/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Directive, Input, HostBinding } from '@angular/core';


@Directive({ selector: '[collapse]' })
export class CollapseDirective {
    // style
    @HostBinding('style.height')
    private height: string;
    // shown
    @HostBinding('class.in')
    @HostBinding('attr.aria-expanded')
    private isExpanded: boolean = true;
    // hidden
    @HostBinding('attr.aria-hidden')
    private isCollapsed: boolean = false;
    // stale state
    @HostBinding('class.collapse')
    private isCollapse: boolean = true;
    // animation state
    @HostBinding('class.collapsing')
    private isCollapsing: boolean = false;

    @Input()
    private set collapse(value: boolean) {
        this.isExpanded = value;
        this.toggle();
    }

    private get collapse(): boolean {
        return this.isExpanded;
    }

    constructor() {
    }

    toggle() {
        if (this.isExpanded) {
            this.hide();
        } else {
            this.show();
        }
    }

    hide() {
        this.isCollapse = false;
        this.isCollapsing = true;

        this.isExpanded = false;
        this.isCollapsed = true;
        setTimeout(() => {
            this.height = '0';
            this.isCollapse = true;
            this.isCollapsing = false;
        }, 4);
    }

    show() {
        this.isCollapse = false;
        this.isCollapsing = true;

        this.isExpanded = true;
        this.isCollapsed = false;
        setTimeout(() => {
            this.height = 'auto';

            this.isCollapse = true;
            this.isCollapsing = false;
        }, 4);
    }
}
