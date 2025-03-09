import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Heading, Bold, Essentials, Italic, Mention, Paragraph, Undo, Link, List } from 'ckeditor5';

@Component({
  selector: 'app-dynamic-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CKEditorModule],
  templateUrl: './dynamic-textarea.component.html',
  styleUrl: './dynamic-textarea.component.css'
})
export class DynamicTextareaComponent {
  @Input() field: any;
  formName: FormGroup;

  constructor(private formgroupDirective: FormGroupDirective) {
    this.formName = formgroupDirective.control;
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
