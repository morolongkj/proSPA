import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { ToastService } from '../_services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (
    authService.getUserRoles().includes('admin') ||
    authService.getUserRoles().includes('superadmin') ||
    authService.getUserRoles().includes('tender_board_member') ||
    authService.getUserRoles().includes('procurement_manager') ||
    authService.getUserRoles().includes('procurement_assistant') ||
    authService.getUserRoles().includes('quality_assurance_manager') ||
    authService.getUserRoles().includes('quality_assurance_assistant')
  ) {
    return true;
  } else {
    toastService.error('You cannot enter this area');
    router.navigate(['/unauthorised']);
    return false;
  }
};
