import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public currentToken: string | undefined;
  public currentUser: string | undefined;

  public loggedInSubject: Subject<void> = new Subject();

  private apiUrl = 'https://api.wof.rtrydev.com/auth';

  constructor(private httpClient: HttpClient, private zone: NgZone) { }

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
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.currentToken = undefined;
    this.currentUser = undefined;

    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }
}
