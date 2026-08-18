import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type InputType = 'text' | 'search' | 'email' | 'password' | 'number' | 'date';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  type = input<InputType>('text');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
