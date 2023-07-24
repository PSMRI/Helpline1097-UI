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


import { Observable } from 'rxjs/Rx';
import { CommonDialogComponent } from './../../common-dialog/common-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ConfirmationDialogsService {
    private isShown: boolean = false;
    constructor(private dialog: MdDialog, @Inject(DOCUMENT) doc: any) {
    }

    public confirm(title: string, message: string, status: string = 'info',
        btnOkText: string = 'Ok', btnCancelText: string = 'Cancel'): Observable<boolean> {
        if (!this.isShown) {
            let dialogRef: MdDialogRef<CommonDialogComponent>;
            const config = new MdDialogConfig();
            dialogRef = this.dialog.open(CommonDialogComponent, {
                // height: '30%',
                // width: '30%',
                disableClose: true
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.message = message;
            dialogRef.componentInstance.btnOkText = btnOkText;
            dialogRef.componentInstance.btnCancelText = btnCancelText;
            dialogRef.componentInstance.confirmAlert = true;
            dialogRef.componentInstance.alert = false;
            dialogRef.componentInstance.remarks = false;
            dialogRef.componentInstance.status = status;
            dialogRef.afterClosed().subscribe(res => {
                this.isShown = false;
            });
            this.isShown = true;
            return dialogRef.afterClosed();
        }
    }
    public alertConfirm(message: string, status: string = 'info', titleAlign: string = 'center',
    messageAlign: string = 'center', btnOkText: string = 'Ok'): Observable<any> {
    if (!this.isShown) {
        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        // config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(CommonDialogComponent, config);
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.status = status;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.confirmAlert = false;
        dialogRef.componentInstance.alert = true;
        dialogRef.afterClosed().subscribe(res => {
            this.isShown = false;
        }
        )
        this.isShown = true;
        return dialogRef.afterClosed();
    }
}
    public confirmWithoutContainer(title: string, message: string, titleAlign: string = 'center',
        messageAlign: string = 'center', btnOkText: string = 'Ok', btnCancelText: string = 'Cancel'): Observable<boolean> {

        if (!this.isShown) {
            let dialogRef: MdDialogRef<CommonDialogComponent>;
            const config = new MdDialogConfig();
            // config.viewContainerRef = viewContainerRef;

            dialogRef = this.dialog.open(CommonDialogComponent, {
                disableClose: true
            });

            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.message = message;
            dialogRef.componentInstance.btnOkText = btnOkText;
            dialogRef.componentInstance.btnCancelText = btnCancelText;
            dialogRef.componentInstance.confirmAlert = true;
            dialogRef.componentInstance.alert = false;
            dialogRef.componentInstance.remarks = false;
            dialogRef.afterClosed().subscribe(res => {
                this.isShown = false;
            });
            this.isShown = true;
            return dialogRef.afterClosed();
        }
    }

    public alert(message: string, status: string = 'info', titleAlign: string = 'center',
        messageAlign: string = 'center', btnOkText: string = 'Ok'): void {

        if (!this.isShown) {
            let dialogRef: MdDialogRef<CommonDialogComponent>;
            const config = new MdDialogConfig();
            // config.viewContainerRef = viewContainerRef;
            dialogRef = this.dialog.open(CommonDialogComponent, {
                disableClose: true
            });
            dialogRef.componentInstance.message = message;
            dialogRef.componentInstance.btnOkText = btnOkText;
            dialogRef.componentInstance.confirmAlert = false;
            dialogRef.componentInstance.alert = true;
            dialogRef.componentInstance.remarks = false;
            dialogRef.componentInstance.status = status;
            dialogRef.afterClosed().subscribe(res => {
                this.isShown = false;
            });
            this.isShown = true;
        }

    }
    public remarks(message: string, titleAlign: string = 'center',
        messageAlign: string = 'center', btnOkText: string = 'Submit'): Observable<any> {
        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        // config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(CommonDialogComponent, {
            disableClose: true
        });
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.confirmAlert = false;
        dialogRef.componentInstance.alert = false;
        dialogRef.componentInstance.remarks = true;
        dialogRef.afterClosed().subscribe(res => {
            this.isShown = false;
        });
        this.isShown = true;
        return dialogRef.afterClosed();
    }
    public close(): void {
        this.isShown = false;
    }
}
