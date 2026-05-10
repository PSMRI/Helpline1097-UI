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
import { environment } from '../../../environments/environment';

/**
 * Service to manage application configuration and API base URLs.
 * Replaces the legacy config.service.ts.
 * 
 * @author Rohan Saini
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Use environment variables for all base URLs
  readonly commonBaseURL = environment.commonAPI;
  readonly ip1097BaseURL = environment.ip1097;
  readonly telephonyServerURL = environment.telephoneServer;
  readonly adminBaseURL = environment.adminAPI;
  
  readonly localeString = 'en-in';
  readonly defaultWrapupTime = 120;

  constructor() {}

  // Getter methods maintained for legacy compatibility during migration
  getCommonBaseURL() {
    return this.commonBaseURL;
  }

  get1097BaseURL() {
    return this.ip1097BaseURL;
  }

  getTelephonyServerURL() {
    return this.telephonyServerURL;
  }

  getAdminBaseUrl() {
    return this.adminBaseURL;
  }
}
