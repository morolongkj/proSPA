import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionBase } from '../../_models/question-base';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Link,
  List,
  Heading,
} from 'ckeditor5';

@Component({
  standalone: true,
  selector: 'app-question',
  templateUrl: './question.component.html',
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule],
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isInValid() {
    return (
      this.form.controls[this.question.key].touched &&
      !this.form.controls[this.question.key].valid
    );
  }

  public Editor = ClassicEditor;
  public config = {
    // toolbar: [
    //   'heading',
    //   '|',
    //   'bold',
    //   'italic',
    //   'underline',
    //   'strikethrough',
    //   '|',
    //   'link',
    //   'blockquote',
    //   '|',
    //   'bulletedList',
    //   'numberedList',
    //   'todoList',
    //   '|',
    //   'insertTable',
    //   'tableColumn',
    //   'tableRow',
    //   'mergeTableCells',
    //   '|',
    //   'mediaEmbed',
    //   'imageUpload',
    //   '|',
    //   'undo',
    //   'redo',
    // ],
    height: '400px',
    toolbar: [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'heading',
      '|',
      'bulletedList',
      'numberedList',
    ],
    plugins: [
      Heading,
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      Link,
      List,
    ],

    // licenseKey: '<YOUR_LICENSE_KEY>',
    mention: {
      // Mention configuration
      feeds: [
        {
          marker: '@',
          feed: ['@user', '@jane', '@foo', '@bar'],
          minimumCharacters: 1,
        },
      ],
    },
  };
}
