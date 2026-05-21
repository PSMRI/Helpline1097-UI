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

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';

/**
 * Functional AuthGuard to protect routes.
 * Redirects to login if no token is found.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionStorageService);

  // Check for the apiman_key (token) in session storage
  const token = sessionService.getItem('apiman_key');

  if (token) {
    return true;
  }

  // Not logged in, redirect to login page with the return url
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
