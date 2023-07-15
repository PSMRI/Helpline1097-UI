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


import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class SocketService {
    private url: String = "http://10.152.3.99:4000/";
    private socket;

    // constructor() {
    //     this.socket = io(this.url);
    // }

    public sendRoomsArray(data) {
        this.socket.emit('new_user', data);
    }

    public logOut(){
        this.socket.emit('logout',{});
    }

    public leaveRooms(){
        this.socket.emit('all-rooms-leave',{});
    }

    public getMessages = function() {
        return Observable.create((observer) => {
            this.socket.on('get-notification', (message) => {
                observer.next(message);
            });
        });
    }

    public getDebugMessage = function() {
        return Observable.create((observer) => {
            this.socket.on('new-message', (data) => {
                observer.next(data);
            })
        })
    }

    public getSocketURL(){
        return this.url;
    }

    public reInstantiate(){
        this.socket = io(this.url);
    }
}