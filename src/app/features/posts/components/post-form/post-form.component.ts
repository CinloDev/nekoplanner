import { Component, effect, input, output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Platform, PostStatus, Post } from '@core/models';
import { PLATFORM_META } from '@core/config/platforms.config';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputComponent } from '@shared/components/ui/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { DatePickerComponent } from '@shared/components/ui/date-picker/date-picker.component';

export interface PostFormValue {
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledDate?: string;
  tags?: any[];
  media?: any[];
}

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent, 
    SelectComponent,
    DatePickerComponent
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})
export class PostFormComponent implements OnInit {
  readonly initialPost = input<Post | null>(null);
  readonly save = output<PostFormValue>();
  readonly cancel = output<void>();

  form!: FormGroup;
  platformOptions: SelectOption<Platform>[] = Object.entries(PLATFORM_META).map(([key, meta]) => ({
    value: key as Platform,
    label: meta.label
  }));

  statusOptions: SelectOption<PostStatus>[] = [
    { value: 'idea', label: 'Idea' },
    { value: 'draft', label: 'Borrador' },
    { value: 'scheduled', label: 'Programada' },
    { value: 'published', label: 'Publicada' },
    { value: 'archived', label: 'Archivada' }
  ];

  constructor(private fb: FormBuilder) {
    effect(() => {
      const post = this.initialPost();
      if (post && this.form) {
        this.form.patchValue({
          title: post.title,
          content: post.content,
          platform: post.platform,
          status: post.status,
          scheduledDate: post.scheduledDate || ''
        });
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.maxLength(2200)]],
      platform: [null, [Validators.required]],
      status: ['draft', [Validators.required]],
      scheduledDate: ['']
    });

    // Validacion condicional para scheduledDate
    this.form.get('status')?.valueChanges.subscribe(status => {
      const scheduledDateCtrl = this.form.get('scheduledDate');
      if (status === 'scheduled') {
        scheduledDateCtrl?.setValidators([Validators.required]);
      } else {
        scheduledDateCtrl?.clearValidators();
      }
      scheduledDateCtrl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const result: PostFormValue = {
        title: formValue.title,
        content: formValue.content || '',
        platform: formValue.platform,
        status: formValue.status,
        scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate).toISOString() : undefined,
        tags: this.initialPost()?.tags || [],
        media: this.initialPost()?.media || []
      };
      
      this.save.emit(result);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Helpers para validacion visual en template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getControlValue(controlName: string): any {
    return this.form.get(controlName)?.value;
  }

  updateControlValue(controlName: string, value: any): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
    }
  }
}
