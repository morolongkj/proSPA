import { AfterViewInit, Component, Input } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { filter, takeWhile } from 'rxjs';
import { MessageService } from '../../../_services/message.service';
import { CommonModule } from '@angular/common';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
  ],
  templateUrl: './dynamic-select.component.html',
  styleUrl: './dynamic-select.component.css',
})
export class DynamicSelectComponent implements AfterViewInit {
  @Input() field: any;
  formName: FormGroup;
  alive = true;

  constructor(
    private messageService: MessageService,
    private formGroupDirective: FormGroupDirective
  ) {
    this.formName = formGroupDirective.control;
  }

  ngAfterViewInit(): void {
    this.listenForLinkData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  listenForLinkData() {
    if (!this.field?.link) {
      return;
    }
    this.messageService.message$
      .pipe(
        filter((v) => v.link === this.field.link),
        takeWhile(() => this.alive)
      )
      .subscribe((v) => {
        this.field.options = v.data;
      });
  }

  changedValue(value: string) {
    if (!this.field.provideData) {
      return;
    }
    this.messageService.messageSubject.next({
      link: this.field.fieldName,
      data: this.field.provideData.filter(
        (v: { sourceValue: string }) => v.sourceValue === value
      ),
    });
  }
}
