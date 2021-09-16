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