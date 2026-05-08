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
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionStorage = inject(SessionStorageService);

  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly APIMAN_KEY = 'apiman_key';

  public getToken(): string | null {
    return this.sessionStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  public getApimanKey(): string | null {
    return this.sessionStorage.getItem(this.APIMAN_KEY);
  }

  public setToken(token: string): void {
    this.sessionStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  public setApimanKey(key: string): void {
    this.sessionStorage.setItem(this.APIMAN_KEY, key);
  }

  public removeToken(): void {
    this.sessionStorage.removeItem(this.APIMAN_KEY);
    this.sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
