import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.css']
})
export class ForceLogoutComponent implements OnInit {

  @ViewChild('flform') flform: NgForm;

  constructor(public alertService: ConfirmationDialogsService,
    public forceLogoutService: ForceLogoutService) { }

  ngOnInit() {
  }

  kickout(obj) {
    console.log(obj, 'object values');
    this.forceLogoutService.forcelogout(obj)
      .subscribe(response => {
        console.log(response, 'success post force logout');
        if (response.response.toLowerCase() === 'success'.toLowerCase()) {
          this.alertService.alert('User logged out successfully', 'success');
          this.flform.reset();
        }
      }, err => {
        console.log(err, 'error post force logout');
      })
  }

}
