import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import AOS from 'aos';
import { HasRoleDirective } from '../../../_directives/has-role.directive';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbOffcanvas, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmService } from '../../../_services/confirm.service';
import { ToastService } from '../../../_services/toast.service';
import { TenderService } from '../../../_services/tender.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    HasRoleDirective,
    RouterLink,
    RouterLinkActive,
    NgbPopoverModule,
    CommonModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  private confirmService = inject(ConfirmService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private tenderService = inject(TenderService);
  isLoggedIn: boolean = false;
  tenderStatusList: any[] = [];
  submittedId: string = '';
  verifiedId: string = '';
  approvedId: string = '';
  publishedId: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    AOS.init();
    this.isLoggedIn = this.authService.isAuthenticatedUser();
    this.getTenderStatusList();
  }

  isDropdownLinkActive(routes: string[]): boolean {
    return routes.some((route) => this.router.url.includes(route));
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = this.authService.isAuthenticatedUser();
    this.toastService.success('Successfully logged out!');
    this.router.navigateByUrl('/auth/login');
  }

  confirmLogout() {
    this.confirmService
      .confirm('Confirm Logout', `Are you sure you want to logout?`)
      .then((confirmed: any) => {
        if (confirmed) {
          this.logout();
        }
      });
  }

  getTenderStatusList() {
    this.tenderService.getTenderStatusList().subscribe({
      next: (res: any) => {
        this.tenderStatusList = res.data.tenderStatuses;
        // console.log(this.tenderStatusList);
        this.tenderStatusList.forEach((status) => {
          if (status.status === 'Submitted') {
            this.submittedId = status.id;
          }
          if (status.status === 'Verified') {
            this.verifiedId = status.id;
          }
          if (status.status === 'Approved') {
            this.approvedId = status.id;
          }
          if (status.status === 'Published') {
            this.publishedId = status.id;
          }
        });
      },
    });
  }
}
