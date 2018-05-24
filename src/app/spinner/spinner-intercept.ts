import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class SpinnerIntercept implements HttpInterceptor {
  constructor(
    private loader: NgxSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // start our loader here
        this.loader.show();

        return next.handle(req).do((event: HttpEvent<any>) => {
            // if the event is for http response
            if (event instanceof HttpResponse) {
                // stop our loader here
                this.loader.hide();
            }

        }, (err: any) => {
            // if any error (not for just HttpResponse) we stop our loader
            this.loader.hide();
        });
    }
}
