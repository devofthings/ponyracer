import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}
  private token: string | null = null;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.token) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const clonedRequest = request.clone({ setHeaders: { Authorization: `Bearer ${this.token}` } });
      return next.handle(clonedRequest);
    }
    return next.handle(request);
  }

  setJwtToken(token: string): void {
    this.token = token;
  }

  removeJwtToken(): void {
    this.token = null;
  }
}
