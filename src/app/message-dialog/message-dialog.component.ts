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


import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<MessageDialogComponent>,public HttpServices: HttpServices) { }
  docs: any = [];
  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.data, "DATA ARRAY IN MESSAGE DIALOG WINDOW");
    // this.checkForURL(this.data.message);
    this.docs = this.data.kmdocs;
    for (let i = 0; i < this.docs.length; i++) {
      this.docs[i]['urls'] = this.checkForURL(this.docs[i].notificationDesc)
    }
    console.log('after urls filtering', this.docs);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  result = [];


  urls = [];

  checkForURL(string) {
    this.result = [];
    // var matches=[];
    // matches=string.match(/\bhttp[s,]?:\/\/\S+/gi);
    // console.log("matches",matches);
    //  if(matches) {
    //    if(matches.length>0)
    //    {
    //      this.urls=matches;
    //    }
    //  }
    //  else {
    //    matches = [];
    //  }
    // debugger;
    var request_array1 = string.split(" ");
    console.log("first array split", request_array1);

    for (let i = 0; i < request_array1.length; i++) {
      var req_array1 = request_array1[i].split(",");
      console.log("second array split", req_array1);

      for (let a = 0; a < req_array1.length; a++) {
        var req_array = req_array1[a].split('\n');
        console.log("3rd split", req_array);
        for (let z = 0; z < req_array.length; z++) {
          if (req_array[z].startsWith("www") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")

          )) {
            this.result.push(req_array[z]);
          } else if (req_array[z].startsWith("WWW") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")
          )) {
            this.result.push(req_array[z]);
          } else if (req_array[z].startsWith("https") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")
          )) {
            this.result.push(req_array[z]);
          } else if (req_array[z].startsWith("HTTPS") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")
          )) {
            this.result.push(req_array[z]);
          } else if (req_array[z].startsWith("HTTP") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")
          )) {
            this.result.push(req_array[z]);
          } else if (req_array[z].startsWith("http") && (req_array[z].endsWith(".com") ||
            req_array[z].endsWith(".co") ||
            req_array[z].endsWith(".in") ||
            req_array[z].endsWith(".org") ||
            req_array[z].endsWith(".net") ||
            req_array[z].endsWith(".int") ||
            req_array[z].endsWith(".edu")
          )) {
            this.result.push(req_array[z]);
          }
        }
      }

    }


    console.log(this.result, "RESULT SET OF URLS");
    for (let a = 0; a < this.result.length; a++) {
      if (!this.result[a].toUpperCase().startsWith("HTTPS") && !this.result[a].toUpperCase().startsWith("HTTP")) {
        this.result[a] = "https://" + this.result[a];
      }
    }

    // if (this.result.length > 0) {
    //   this.urls.push(this.result);
    // }

    return this.result;

  }

}
