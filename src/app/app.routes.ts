import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './_guards/auth.guard';
import { UnauthorisedComponent } from './pages/errors/unauthorised/unauthorised.component';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'admin/prequalifications',
    loadComponent: () =>
      import(
        './pages/admin/pre-qualifications/pre-qualification-list/pre-qualification-list.component'
      ).then((c) => c.PreQualificationListComponent),
    runGuardsAndResolvers: 'always',
    // canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/prequalifications/create',
    loadComponent: () =>
      import(
        './pages/admin/pre-qualifications/pre-qualification-create/pre-qualification-create.component'
      ).then((c) => c.PreQualificationCreateComponent),
    runGuardsAndResolvers: 'always',
    // canActivate: [authGuard, adminGuard],
  },
  { path: 'unauthorised', component: UnauthorisedComponent },
  {
    path: '**',
    component: DashboardComponent,
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
];
