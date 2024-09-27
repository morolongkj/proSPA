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
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component').then(
        (c) => c.ForgotPasswordComponent
      ),
  },
  {
    path: 'auth/reset-password/:token',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/admin/user/user-list/user-list.component').then(
        (c) => c.UserListComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'users/create',
    loadComponent: () =>
      import('./pages/admin/user/user-create/user-create.component').then(
        (c) => c.UserCreateComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'questionnaires',
    loadComponent: () =>
      import(
        './pages/questionnaire/questionnaire-list/questionnaire-list.component'
      ).then((c) => c.QuestionnaireListComponent),
    runGuardsAndResolvers: 'always',
    // canActivate: [authGuard, adminGuard],
  },
  {
    path: 'questionnaires/create',
    loadComponent: () =>
      import(
        './pages/questionnaire/questionnaire-create/questionnaire-create.component'
      ).then((c) => c.QuestionnaireCreateComponent),
    runGuardsAndResolvers: 'always',
    // canActivate: [authGuard, adminGuard],
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
