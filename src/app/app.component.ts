import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './authorization.wrapper';
import { InterceptedHttp } from './http.interceptor';
@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
} )
export class AppComponent
{
  cZentrix = true;
  isConnected: Observable<boolean>;

  constructor(private httpInterceptor: InterceptedHttp, private securityInterceptor: AuthorizationWrapper){
    this.isConnected = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));
  }
  ngOnInit(){
    this.isConnected.subscribe((bool)=>{
      this.httpInterceptor.onlineFlag = bool;
      this.securityInterceptor.onlineFlag = bool;
    });
  }
}
