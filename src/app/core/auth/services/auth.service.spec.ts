import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserClaims } from '../../../shared/models/task.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token upon successful login', fakeAsync(() => {
    service.login('test@example.com', 'password').subscribe();
    tick(500); // Wait for delay

    const token = localStorage.getItem('taskflow_token');
    expect(token).toBeTruthy();
    expect(service.getCurrentUser()?.email).toBe('test@example.com');
  }));

  it('should clear state on logout', () => {
    // Setup initial state
    localStorage.setItem('taskflow_token', 'fake-token');

    service.logout();

    expect(localStorage.getItem('taskflow_token')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('isAuthenticated$ should emit true when user is logged in', fakeAsync(() => {
    let isAuthenticated = false;
    service.isAuthenticated$().subscribe(val => isAuthenticated = val);

    service.login('test@example.com', 'password').subscribe();
    tick(500);

    expect(isAuthenticated).toBeTrue();
  }));
});
