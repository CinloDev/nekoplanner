import { Component, effect, input, output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Idea, Tag } from '@core/models';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputComponent } from '@shared/components/ui/input/input.component';

export interface IdeaFormValue {
  title: string;
  content: string;
  tags: Tag[];
}

@Component({
  selector: 'app-idea-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent
  ],
  templateUrl: './idea-form.component.html',
  styleUrl: './idea-form.component.scss'
})
export class IdeaFormComponent implements OnInit {
  readonly initialIdea = input<Idea | null>(null);
  readonly save = output<IdeaFormValue>();
  readonly cancel = output<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    effect(() => {
      const idea = this.initialIdea();
      if (idea && this.form) {
        const tagsString = (idea.tags || []).map(t => t.name).join(', ');
        this.form.patchValue({
          title: idea.title,
          content: idea.content,
          tags: tagsString
        });
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      content: ['', [Validators.maxLength(2000)]],
      tags: [''] // Comma separated string for simplicity
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const parsedTags: Tag[] = formValue.tags
        ? formValue.tags.split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)
            .map((name: string) => {
              // Intenta preservar el ID/color si ya existía en la idea inicial
              const existing = this.initialIdea()?.tags?.find(tag => tag.name.toLowerCase() === name.toLowerCase());
              return existing ? existing : { id: crypto.randomUUID(), name };
            })
        : [];

      const result: IdeaFormValue = {
        title: formValue.title,
        content: formValue.content || '',
        tags: parsedTags
      };
      
      this.save.emit(result);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

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
