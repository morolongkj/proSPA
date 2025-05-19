import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HasRoleDirective } from '../../../_directives/has-role.directive';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, HasRoleDirective, NgbTooltipModule],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.css',
})
export class AdminStatsComponent {
  adminTools = [
    {
      key: 'user_count',
      title: 'Manage Users',
      icon: 'bi-people',
      description: 'Create, update and delete users',
      route: '/users',
      stat: 0, // Example count
      color: 'bg-primary',
    },
    // {
    //   title: 'Manage Roles',
    //   icon: 'bi-person-badge',
    //   description: 'Create, update and delete roles',
    //   route: '/roles',
    //   stat: 12,
    //   color: 'bg-warning',
    // },
    {
      key: 'category_count',
      title: 'Manage Categories',
      icon: 'bi-list-ul',
      description: 'Create, update and delete categories',
      route: '/categories',
      stat: 0,
      color: 'bg-warning',
    },
    {
      key: 'product_count',
      title: 'Manage Products',
      icon: 'bi-box-seam',
      description: 'Create, update and delete products',
      route: '/products',
      stat: 0,
      color: 'bg-success',
    },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get('/dashboard/stats').subscribe({
      next: (res: any) => {
        console.log(res);
        this.adminTools = this.adminTools.map((tool) => ({
          ...tool,
          stat: res.data[tool.key] ?? 0,
        }));
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      },
    });
  }
}
