import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  authService = inject(AuthService);
  router = inject(Router)


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
