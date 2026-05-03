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


import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

/* This service is used to display message for a specific opertation */
@Injectable()
export class Message {

    actionButtonLabel: string = 'OK';
    action: boolean = false;
    setAutoHide: boolean = true;
    autoHide: number = 10000;
    addExtraClass: boolean = false;

    constructor(public snackBar: MdSnackBar) { }

    openSnackBar(message) {
        const config = new MdSnackBarConfig();
        config.duration = this.autoHide;
    config.extraClasses = this.addExtraClass ? ['party'] : undefined;
        this.snackBar.open(message,'OK');
    }
}
