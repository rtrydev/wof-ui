import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap, take } from "rxjs/operators"
import { LoginService } from "../services/login.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this.loginService.currentToken).pipe(
        take(1),
        switchMap(token => {
            if (!token) next.handle(req);

            const modifiedReq = req.clone({ headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) });
            return next.handle(modifiedReq).pipe(
              catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Unauthorized) {
                  this.loginService.logout();
                }
                return throwError(() => {
                  throw error;
                });
              })
            );
        })
    );
  }
}