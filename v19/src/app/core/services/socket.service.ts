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
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { ConfigService } from './config.service';

/**
 * Modern SocketService for real-time notifications.
 * Replaces legacy implementation with modern Socket.io client and RxJS.
 */
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private config = inject(ConfigService);
  private socket!: Socket;
  
  // Base URL from config
  private readonly url = this.config.getTelephonyServerURL();

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: false
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  sendNewUser(data: any) {
    this.socket.emit('new_user', data);
  }

  logOut() {
    this.socket.emit('logout', {});
    this.disconnect();
  }

  /**
   * Listen for notifications
   */
  getMessages(): Observable<any> {
    return fromEvent(this.socket, 'get-notification');
  }

  /**
   * Listen for debug messages
   */
  getDebugMessages(): Observable<any> {
    return fromEvent(this.socket, 'new-message');
  }
}
