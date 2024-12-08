import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { ExcelService } from '../../../../_services/excel.service';
import { QuestionService } from '../../../../_services/question.service';
import { ReadExcelComponent } from '../../../../_shared/read-excel/read-excel.component';

@Component({
  selector: 'app-document-export',
  standalone: true,
  providers: [QuestionService],
  imports: [
    AsyncPipe,
    DynamicFormComponent,
    RouterLink,
    CommonModule,
    ReadExcelComponent,
  ],
  templateUrl: './document-export.component.html',
  styleUrl: './document-export.component.css',
})
export class DocumentExportComponent implements OnInit {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private excelService = inject(ExcelService);
  private route = inject(ActivatedRoute);

  documents: any[] = [];

  constructor(service: QuestionService) {
    this.questions$ = service.getExportQuestions();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.documents = data['documents']['data']['documents'];
    });
  }

  handleFormSubmit(event: any) {
    this.excelService.downloadExcelFile(
      this.documents,
      event.formData.fileName + '.xlsx'
    );
  }
}
