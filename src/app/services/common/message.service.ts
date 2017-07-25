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
