import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NgbPopoverModule,
  NgbTooltipModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { ConfirmService } from '../../../../_services/confirm.service';
import { UserService } from '../../../../_services/user.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  providers: [QuestionService],
  imports: [
    NgxPaginationModule,
    FormsModule,
    AsyncPipe,
    DynamicFormComponent,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  private confirmService = inject(ConfirmService);
  users: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;

  filters: any = {};

  questions$: Observable<QuestionBase<any>[]>;
  roleQuestions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  selectedUser: any = {};

  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getUserFiltersQuestions();
    this.roleQuestions$ = questionService.getUserAddRoleQuestions();
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.userService
      .getUserWithRoles(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res) => {
          this.users = res.data.users;
          this.total = res.data.total;
          console.log(this.users);
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getUsersWithRoles();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getUsersWithRoles();
  }

  handleFormSubmit(event: any) {
    const model = {
      email: event.formData.emailAddress,
      first_name: event.formData.firstName,
      last_name: event.formData.lastName,
      gender: event.formData.gender,
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getUsersWithRoles();
  }

  banUser(user: any) {
    this.userService.banUser(user.id).subscribe({
      next: (res: any) => {
        console.log(res);
        user.status = 'banned';
        this.toastService.success(
          user.first_name + ' is banned from accessing the system',
          'Ban Status'
        );
      },
    });
  }

  unBanUser(user: any) {
    this.userService.unBanUser(user.id).subscribe({
      next: (res: any) => {
        console.log(res);
        user.status = null;
        this.toastService.success(
          user.first_name + ' can now access the system',
          'Ban Status'
        );
      },
    });
  }

  submitRole(event: any) {
    const role = event.formData.role;
    console.log(event.formData);
    if (this.selectedUser.roles.includes(role)) {
      this.toastService.warning(
        role + ' role is already assigned to ' + this.selectedUser.first_name,
        'Already Assigned'
      );
    } else {
      // assign role
      const model = {
        role: role,
      };
      this.userService
        .updateUserRoles('addrole', model, this.selectedUser.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // Find the index of the selected user in the users list
            const userIndex = this.users.findIndex(
              (user) => user.id === this.selectedUser.id
            );

            if (userIndex !== -1) {
              // Update the user's roles in the list
              this.users[userIndex].roles.push(role);
              this.toastService.success('Role is added successfully');
            }
          },
          error: (err: any) => {
            this.toastService.error('Some error occured');
          },
        });
    }
  }

  removeRole(role: string) {
    if (!this.selectedUser.roles.includes(role)) {
      this.toastService.warning(
        role + ' role is not assigned to ' + this.selectedUser.first_name,
        'Not Assigned'
      );
    } else {
      // assign role
      const model = {
        role: role,
      };
      this.userService
        .updateUserRoles('removerole', model, this.selectedUser.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // Find the index of the selected user in the users list
            const userIndex = this.users.findIndex(
              (user) => user.id === this.selectedUser.id
            );

            if (userIndex !== -1) {
              // Update the user's roles in the list
              const roleIndex = this.users[userIndex].roles.indexOf(role);
              if (roleIndex !== -1) {
                this.users[userIndex].roles.splice(roleIndex, 1);
                this.toastService.success('Role is removed successfully');
              }
            }
          },
          error: (err: any) => {
            this.toastService.error('Some error occured');
          },
        });
    }
  }

  toggleEdit(user: any) {
    user.isEditing = !user.isEditing;
  }

  saveUser(user: any) {
    user.isEditing = false;
    console.log(user);
    const model = {
      first_name: user.first_name,
      last_name: user.last_name,
    };
    this.userService.updateUser(user.id, model).subscribe({
      next: (res: any) => {
        Object.assign(user, res);
        const index = this.users.findIndex((attr: any) => attr.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteUser(user: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${user.type}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.userService.deleteUser(user.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.users = this.users.filter(
                (item: any) => item.id !== user.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting user', err);
              this.toastService.success('Error deleting user');
            },
          });
        }
      });
  }

  resetPassword(content: TemplateRef<any>, user: any) {
    this.selectedUser = user;
    this.modalService.open(content, { centered: true });
  }

  changePassword(event: any) {
    const password = event.formData.password;
    const confirmPassword = event.formData.confirmPassword;
    console.log(event.formData);
    if (password === confirmPassword) {
      const model = {
        password: password,
      };
      this.userService.changePassword(model, this.selectedUser.id).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastService.success('Password is changed successfully');
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.toastService.error('Some error occured');
        },
      });
    } else {
      this.toastService.error('Passwords do not match');
    }
  }
}
