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
  selector: 'app-category-export',
  standalone: true,
  providers: [QuestionService],
  imports: [
    AsyncPipe,
    DynamicFormComponent,
    RouterLink,
    CommonModule,
    ReadExcelComponent,
  ],
  templateUrl: './category-export.component.html',
  styleUrl: './category-export.component.css'
})
export class CategoryExportComponent implements OnInit{
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private excelService = inject(ExcelService);
  private route = inject(ActivatedRoute);

  categories: any[] =[];

  constructor(service: QuestionService) {
    this.questions$ = service.getExportQuestions();
  }

  ngOnInit(): void {
     this.route.data.subscribe(data => {
      this.categories = data['categories']['data']['categories'];
    });
  }


  handleFormSubmit(event: any) {
    this.excelService.downloadExcelFile(this.categories, event.formData.fileName+'.xlsx');
  }

}
