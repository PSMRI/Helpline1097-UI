/*
* Created by Pankush Manchanda 10,August 2017
* Http Interceptor to add diffrent function to http request like passing option in every request
* Advantage : Used to remove the code duplication
*/

import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { InterceptedHttp } from './http.interceptor';
import { LoaderService } from './services/common/loader.service'


export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, loaderService: LoaderService): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, loaderService);
}
