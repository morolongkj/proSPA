import { Component, inject, OnInit } from '@angular/core';
import AOS from 'aos';
import { AuthService } from '../../_services/auth.service';
import { CompanyService } from '../../_services/company.service';
import { tap, finalize, takeUntil, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../_services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FullCalendarModule,
    HasRoleDirective,
    NgbTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);

  company: any = {};
  isLoadingCompany: boolean = true;
  private unsubscribe$ = new Subject<void>();

  events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'eventsTitle',
      center: '', // Leave center section empty (no title)
      right: 'today prev,next', // Keep only the "Today" button on the right
    },
    customButtons: {
      eventsTitle: {
        text: 'Events', // The plain text to display
      },
      // viewMore: {
      //   text: 'View More', // The custom title text
      //   click: () => {
      //     console.log('View more clicked');
      //   },
      // },
    },
    weekends: true,
    events: [{ title: 'Meeting', start: new Date() }],
  };

  constructor() {}

  ngOnInit(): void {
    AOS.init();
    if (this.authService.getCompanyId() !== null) {
      const companyId: any = this.authService.getCompanyId() ?? '';
      this.loadCompany(companyId);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCompany(id: string) {
    this.companyService
      .getCompany(id)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              this.company = res;
              console.log(this.company);
              this.company['final_extra_data'] = this.parseExtraData(
                this.company['extra_data']
              );
              console.log(this.parseExtraData(this.company['extra_data']));
              console.log(this.company);
            }
          },
          error: (error) => alert(error),
        }),
        finalize(() => (this.isLoadingCompany = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  parseExtraData(data: string): any[] {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing extra data:', error);
      return [];
    }
  }

}
