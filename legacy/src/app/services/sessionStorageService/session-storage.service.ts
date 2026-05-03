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
import { environment } from 'environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class sessionStorageService {

    SECRET_KEY = environment.encKey;
    constructor(
      //private cryptoService: CryptoEncService,
    ) {}
  
  
  //   safeToString(value: any): any {
  //     if (value === null || value === undefined) {
  //         return '';
  //     }
  //     return value.toString();
  // }
  
    setItem(key: string, value: any): void {
          
      const ciphertext = CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString();
      sessionStorage.setItem(key,ciphertext);


    }
  
    getItem(key: string): any | null {
      let text=sessionStorage.getItem(key)
      if(text && text!==null){
        const bytes = CryptoJS.AES.decrypt(text, this.SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
    //   return this.store.get(key, this.SECRET_KEY);
    return originalText 
      }
    }

   

  
    
   
  
    removeItem(key: string): void {
      sessionStorage.removeItem(key);
    }
  
    clear(): void {
      sessionStorage.clear();
    }

    
     setCookie(name:any, value:any, days:number) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }  document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    getCookie(name:any) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

  
  }
  