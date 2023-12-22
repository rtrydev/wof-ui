import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public currentToken: string | undefined;
  public currentUser: string | undefined;

  private apiUrl = 'https://api.wof.rtrydev.com/auth';

  constructor(private httpClient: HttpClient) { }

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

        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
