import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserClaims } from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'taskflow_token';
  private currentUserSubject = new BehaviorSubject<UserClaims | null>(null);

  constructor() {
    this.checkToken();
  }

  isAuthenticated$(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.currentUserSubject.subscribe(user => {
        observer.next(!!user);
      });
    });
  }

  getCurrentUser(): UserClaims | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(
      delay(500),
      tap(() => {
        const token = this.generateFakeToken(email);
        localStorage.setItem(this.TOKEN_KEY, token);
        this.checkToken();
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  private checkToken(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        // In a real app we would decode JWT here. 
        // For simulation, we parse the fake JSON token
        const claims = JSON.parse(atob(token)) as UserClaims;

        if (claims.exp * 1000 > Date.now()) {
          this.currentUserSubject.next(claims);
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  private generateFakeToken(email: string): string {
    const claims: UserClaims = {
      sub: '1234567890',
      email: email,
      name: 'Task User',
      roles: ['user'],
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    };
    return btoa(JSON.stringify(claims));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
