import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public showLogin = false;
  public currentUser: string | undefined;

  public username: string | undefined;
  public password: string | undefined;

  public loggingIn = false;
  public loginFailure = false;

  private refreshSub?: Subscription;
  private boundCallback: any;

  constructor(private loginService: LoginService) {
    this.boundCallback = this.outsideClickCallback.bind(this);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      this.loginService.currentToken = token;
      this.loginService.currentUser = username;

      this.currentUser = username;

      this.refreshSub?.unsubscribe();
      this.refreshSub = this.loginService.registerRefresh(true).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  public async submit() {
    if (this.loggingIn || !this.username || !this.password) {
      return;
    }

    this.loggingIn = true;

    const loginSuccess = await this.loginService.login(
      this.username,
      this.password
    );

    this.loggingIn = false;

    if (loginSuccess) {
      this.onLogin();
    } else {
      this.loginFailure = true;
    }
  }

  public toggleLogin() {
    this.showLogin = !this.showLogin;

    if (this.showLogin) {
      setTimeout(() => {
        document.addEventListener('click', this.boundCallback);
      });
    }
  }

  public inputChange() {
    this.loginFailure = false;
  }

  public logout() {
    this.loginService.logout();
  }

  private outsideClickCallback(event: MouseEvent) {
    let searchElement = event.target as Element;
    const loginCard = document.getElementById('wof-login-card');

    if (!loginCard) {
      this.showLogin = false;
      document.removeEventListener('click', this.boundCallback);
    }

    while(searchElement !== loginCard && (searchElement=searchElement.parentNode as Element));

    if (searchElement) {
      return;
    }

    this.showLogin = false;
    document.removeEventListener('click', this.boundCallback);
  }

  private onLogin() {
    document.removeEventListener('click', this.boundCallback);
    this.showLogin = false;
    this.currentUser = this.loginService.currentUser;
    this.refreshSub?.unsubscribe();
    this.refreshSub = this.loginService.registerRefresh(false).subscribe();
  }
}
