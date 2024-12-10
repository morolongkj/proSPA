import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './_guards/auth.guard';
import { UnauthorisedComponent } from './pages/errors/unauthorised/unauthorised.component';
import { adminGuard } from './_guards/admin.guard';
import { categoryListResolver } from './_resolvers/category-list.resolver';
import { productListResolver } from './_resolvers/product-list.resolver';
import { companyDetailsResolver } from './_resolvers/company-details.resolver';
import { documentListResolver } from './_resolvers/document-list.resolver';

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
    resolve: { company: companyDetailsResolver },
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
    path: 'categories',
    loadComponent: () =>
      import(
        './pages/admin/category/category-list/category-list.component'
      ).then((c) => c.CategoryListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import(
        './pages/admin/category/category-create/category-create.component'
      ).then((c) => c.CategoryCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'categories/import',
    loadComponent: () =>
      import(
        './pages/admin/category/category-import/category-import.component'
      ).then((c) => c.CategoryImportComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'categories/export',
    loadComponent: () =>
      import(
        './pages/admin/category/category-export/category-export.component'
      ).then((c) => c.CategoryExportComponent),
    runGuardsAndResolvers: 'always',
    resolve: { categories: categoryListResolver },
    canActivate: [adminGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/admin/product/product-list/product-list.component').then(
        (c) => c.ProductListComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import(
        './pages/admin/product/product-create/product-create.component'
      ).then((c) => c.ProductCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'products/import',
    loadComponent: () =>
      import(
        './pages/admin/product/product-import/product-import.component'
      ).then((c) => c.ProductImportComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'products/export',
    loadComponent: () =>
      import(
        './pages/admin/product/product-export/product-export.component'
      ).then((c) => c.ProductExportComponent),
    runGuardsAndResolvers: 'always',
    resolve: { products: productListResolver },
    canActivate: [adminGuard],
  },
  {
    path: 'documents',
    loadComponent: () =>
      import(
        './pages/admin/document/document-list/document-list.component'
      ).then((c) => c.DocumentListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'documents/create',
    loadComponent: () =>
      import(
        './pages/admin/document/document-create/document-create.component'
      ).then((c) => c.DocumentCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'documents/import',
    loadComponent: () =>
      import(
        './pages/admin/document/document-import/document-import.component'
      ).then((c) => c.DocumentImportComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'documents/export',
    loadComponent: () =>
      import(
        './pages/admin/document/document-export/document-export.component'
      ).then((c) => c.DocumentExportComponent),
    runGuardsAndResolvers: 'always',
    resolve: { documents: documentListResolver },
    canActivate: [adminGuard],
  },
  {
    path: 'tenders',
    loadComponent: () =>
      import(
        './pages/procurement/tender/tender-list/tender-list.component'
      ).then((c) => c.TenderListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'tenders/create',
    loadComponent: () =>
      import(
        './pages/procurement/tender/tender-create/tender-create.component'
      ).then((c) => c.TenderCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [adminGuard],
  },
  {
    path: 'questionnaires',
    loadComponent: () =>
      import(
        './pages/questionnaire/questionnaire-list/questionnaire-list.component'
      ).then((c) => c.QuestionnaireListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'questionnaires/create',
    loadComponent: () =>
      import(
        './pages/questionnaire/questionnaire-create/questionnaire-create.component'
      ).then((c) => c.QuestionnaireCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/pre-qualification',
    loadComponent: () =>
      import(
        './pages/admin/pre-qualifications/pre-qualification-list/pre-qualification-list.component'
      ).then((c) => c.PreQualificationListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/pre-qualification/create',
    loadComponent: () =>
      import(
        './pages/admin/pre-qualifications/pre-qualification-create/pre-qualification-create.component'
      ).then((c) => c.PreQualificationCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard, adminGuard],
  },

  {
    path: 'supplier/tenders',
    loadComponent: () =>
      import(
        './pages/supplier/tender/open-tender-list/open-tender-list.component'
      ).then((c) => c.OpenTenderListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'supplier/bids',
    loadComponent: () =>
      import('./pages/supplier/bid/bid-list/bid-list.component').then(
        (c) => c.BidListComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'supplier/bids/create',
    loadComponent: () =>
      import('./pages/supplier/bid/bid-create/bid-create.component').then(
        (c) => c.BidCreateComponent
      ),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'supplier/companies/create',
    loadComponent: () =>
      import(
        './pages/supplier/company/company-create/company-create.component'
      ).then((c) => c.CompanyCreateComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'supplier/questionnaires',
    loadComponent: () =>
      import(
        './pages/supplier/questionnaire/open-questionnaire-list/open-questionnaire-list.component'
      ).then((c) => c.OpenQuestionnaireListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
  },
  {
    path: 'supplier/prequalification',
    loadComponent: () =>
      import(
        './pages/supplier/prequalification/prequalification-list/prequalification-list.component'
      ).then((c) => c.PrequalificationListComponent),
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
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
