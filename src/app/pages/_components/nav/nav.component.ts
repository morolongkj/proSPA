import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import AOS from 'aos';
import { HasRoleDirective } from '../../../_directives/has-role.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [HasRoleDirective, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    AOS.init();
    this.isLoggedIn = this.authService.isAuthenticatedUser();
  }
}
