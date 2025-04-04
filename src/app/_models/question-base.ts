export class QuestionBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];
  richText?: boolean;
  isRadioGroup?: boolean;
  isCheckbox?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
      richText?: boolean;
      isRadioGroup?: boolean;
      isCheckbox?: boolean;
      hidden?: boolean;
      readonly?: boolean;
      min?: number;
      max?: number;
      maxLength?: number;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.richText = !!options.richText;
    this.isRadioGroup = !!options.isRadioGroup;
    this.isCheckbox = !!options.isCheckbox;
    this.hidden = !!options.hidden;
    this.readonly = !!options.readonly;
    this.min = options.min;
    this.max = options.max;
    this.maxLength = options.maxLength;
  }
}
