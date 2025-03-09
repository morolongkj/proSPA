import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../../_models/question-base';
import { QuestionControlService } from '../../_services/question-control.service';
import { DynamicFormQuestionComponent } from '../question/question.component';

export interface SubmitEventData {
  formData: any;
  // Add other properties as needed
}

@Component({
  standalone: true,
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
  imports: [CommonModule, DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[] | null = [];
  @Input() btnText: String = 'Save';
  @Input() perPage: number = 2;
  @Output() submitEvent = new EventEmitter<SubmitEventData>();
  form!: FormGroup;
  payLoad = '';
  currentPage = 1;
  // Adjust as needed
  totalQuestions: number = 0;
  currentQuestions: any;
  constructor(private qcs: QuestionControlService) {}
  ngOnInit() {
    this.totalQuestions = this.questions?.length || 0;
    this.currentQuestions = this.getCurrentQuestions();
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
  }

  getCurrentQuestions() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    return this.questions?.slice(startIndex, endIndex);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    const formData = this.form.value;
    console.table(formData);
    const submitData: SubmitEventData = { formData };
    this.submitEvent.emit(submitData);
    // this.form.reset();
  }

  resetForm() {
    this.form.reset();
  }

  onNext() {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.currentQuestions = this.getCurrentQuestions();
      console.log(this.currentPage);
    }
  }

  onPrevious() {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.currentQuestions = this.getCurrentQuestions();
      console.log(this.currentPage);
    }
  }

  isLastPage() {
    return this.currentPage === Math.ceil(this.totalQuestions / this.perPage);
  }

  isFirstPage() {
    return this.currentPage === 1;
  }
}
