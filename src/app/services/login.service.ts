import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public currentToken: string | undefined;
  public currentUser: string | undefined;

  public loggedInSubject: Subject<void> = new Subject();

  private apiUrl = 'https://api.wof.rtrydev.com/auth';

  constructor(private httpClient: HttpClient, private zone: NgZone, private router: Router) { }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const result = await lastValueFrom(this.httpClient.post<{token: string}>(`${this.apiUrl}/login`, {
        username,
        password
      }));

      if (result.token) {
        this.currentToken = result.token;
        this.currentUser = username;

        localStorage.setItem('token', result.token);
        localStorage.setItem('username', username);

        this.loggedInSubject.next();
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  public logout() {
    const wasLogged = !!this.currentToken || !!this.currentUser;

    if (!wasLogged) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.currentToken = undefined;
    this.currentUser = undefined;

    this.router.navigateByUrl('/').then(() => {
      this.zone.runOutsideAngular(() => {
        location.reload();
      });
    });
  }
}
