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

import { Injectable, inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private config = inject(ConfigService);
  private readonly SECRET_KEY = this.config.aesSecretKey;

  constructor() {}

  setItem(key: string, value: any): void {
    if (value === null || value === undefined) return;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const ciphertext = CryptoJS.AES.encrypt(stringValue, this.SECRET_KEY).toString();
    sessionStorage.setItem(key, ciphertext);
  }

  getItem(key: string): string | null {
    const text = sessionStorage.getItem(key);
    if (text) {
      try {
        const bytes = CryptoJS.AES.decrypt(text, this.SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
