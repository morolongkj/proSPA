import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { ToastService } from '../../../../_services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import AOS from 'aos';
import { AuthService } from '../../../../_services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css',
})
export class NotificationListComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  notifications: any[] = [];
  selectedNotification: any = {};

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = true;

  filters: any = {};
  private unsubscribe$ = new Subject<void>();
  // notifications = [
  //   { message: 'New user registered!', read: false },
  //   { message: 'Server backup completed.', read: true },
  //   { message: 'System update available.', read: false },
  // ];

  // markAsRead(index: number): void {
  //   this.notifications[index].read = true;
  // }
  searchText: string = '';
  companyId: string = '';

  filteredNotifications: any[] = [];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    AOS.init();
    this.companyId = this.authService.getCompanyId() ?? '';
    if (this.companyId) {
      this.filters.company_id = this.companyId;
      this.getNotifications();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getNotifications() {
    this.notificationService
      .getNotifications(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              // console.log(res);
              this.notifications = res.data.notifications;
              console.log(this.notifications);
              this.total = res.data.total;
              this.filteredNotifications = [...this.notifications];
            }
          },
          error: (error) => alert(error),
        }),
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getNotifications();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.perPage = event.target.value;
    this.page = 1;
    this.getNotifications();
    // }
  }

  onSearch(searchText: string): void {
    this.searchText = searchText;
    console.log('Search initiated with text:', this.searchText);
    this.filters.searchTerm = this.searchText;
    this.getNotifications();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filters.searchTerm = this.searchText;
    this.getNotifications();
  }

  filterNotifications(filter: string): void {
    if (filter === 'all') {
      this.filteredNotifications = [...this.notifications];
    } else if (filter === 'unread') {
      this.filteredNotifications = this.notifications.filter(
        (notification) => notification.is_read === '0'
      );
    } else if (filter === 'read') {
      this.filteredNotifications = this.notifications.filter(
        (notification) => notification.is_read === '1'
      );
    }
    console.log(this.filteredNotifications);
  }

  markAsRead(index: number): void {
    const notification = this.notifications[index];

    // Update locally for immediate feedback
    notification.is_read = '1';

    // Call the API to update the notification in the database
    this.notificationService
      .updateNotification(notification.id, { is_read: '1' })
      .subscribe({
        next: (response) =>
          console.log('Notification updated successfully:', response),
        error: (err) => {
          console.error('Error updating notification:', err);
          // Revert the change if the update fails
          notification.is_read = '0';
        },
      });
  }

  openModal(content: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification);
    this.modalService.open(content, {
      centered: false,
      size: 'lg',
      scrollable: true,
    });
  }
}
