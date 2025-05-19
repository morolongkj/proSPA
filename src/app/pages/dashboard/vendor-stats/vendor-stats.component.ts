import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HasRoleDirective } from '../../../_directives/has-role.directive';

@Component({
  selector: 'app-vendor-stats',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HasRoleDirective,
    NgbTooltipModule,
  ],
  templateUrl: './vendor-stats.component.html',
  styleUrl: './vendor-stats.component.css',
})
export class VendorStatsComponent {}
