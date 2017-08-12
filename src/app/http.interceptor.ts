import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable()
export class InterceptedHttp extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
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

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        // url = this.updateUrl(url);
        debugger;
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

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
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

    delete(url: string, options?: RequestOptionsArgs): Observable<any> {
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
    private showLoader() {
        console.log('show loader');
    }
    private hideLoader() {
        console.log('Loader hide')
    }
    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }
}
