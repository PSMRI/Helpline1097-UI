/*
* Created by Pankush Manchanda 10,August 2017
* Http Interceptor to add diffrent function to http request like passing option in every request
* Advantage : Used to remove the code duplication
*/

import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { LoaderService } from './services/common/loader.service'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'

@Injectable()
export class InterceptedHttp extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private loaderService: LoaderService) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        // url = this.updateUrl(url);
        this.showLoader();
        return super.get(url, this.getRequestOptionArgs(options)).catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        // url = this.updateUrl(url);
        this.showLoader();
        return super.post(url, body, this.getRequestOptionArgs(options)).catch(this.onCatch).do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
            .finally(() => {
                this.onEnd();
            });
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        // url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options)).catch(this.onCatch).do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
            .finally(() => {
                this.onEnd();
            });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        // url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options)).catch(this.onCatch).do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
            .finally(() => {
                this.onEnd();
            });
    }

    // private updateUrl(req: string) {
    //     return environment.origin + req;
    // }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type', 'application/json');

        return options;
    }
    private onEnd(): void {
        this.hideLoader();
    }
    private onSuccess(response: any) {
        return response;
    }
    private onError(error: any) {
        return error;
    }
    private showLoader(): void {
        console.log('show loader');
        this.loaderService.show();
    }
    private hideLoader(): void {
        console.log('Loader hide')
        this.loaderService.hide();
    }
    private onCatch(error: any, caught: Observable<Response>): Observable<Response> {
        return Observable.throw(error);
    }
}
