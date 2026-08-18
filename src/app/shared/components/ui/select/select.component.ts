import { Component, ElementRef, HostListener, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent<T> {
  label = input<string>('');
  placeholder = input<string>('Seleccionar...');
  options = input.required<SelectOption<T>[]>();
  value = input<T | null>(null);
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<T | null>();

  isOpen = signal<boolean>(false);
  focusedIndex = signal<number>(-1);

  constructor(private elementRef: ElementRef) {}

  selectedOptionLabel = computed(() => {
    const currentVal = this.value();
    if (currentVal === null) return this.placeholder();
    const opt = this.options().find(o => o.value === currentVal);
    return opt ? opt.label : this.placeholder();
  });

  toggleOpen(): void {
    if (this.disabled()) return;
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.syncFocusedIndex();
    }
  }

  selectOption(option: SelectOption<T>): void {
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen()) {
          const currentIndex = this.focusedIndex();
          if (currentIndex >= 0 && currentIndex < this.options().length) {
            this.selectOption(this.options()[currentIndex]);
          } else {
            this.isOpen.set(false);
          }
        } else {
          this.isOpen.set(true);
          this.syncFocusedIndex();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          this.isOpen.set(false);
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.update(idx => Math.min(idx + 1, this.options().length - 1));
        } else {
          this.isOpen.set(true);
          this.syncFocusedIndex();
        }
        break;
      case 'ArrowUp':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.update(idx => Math.max(idx - 1, 0));
        }
        break;
      case 'Tab':
        this.isOpen.set(false);
        break;
    }
  }

  private syncFocusedIndex(): void {
    const currentVal = this.value();
    if (currentVal !== null) {
      const idx = this.options().findIndex(o => o.value === currentVal);
      this.focusedIndex.set(idx >= 0 ? idx : 0);
    } else {
      this.focusedIndex.set(0);
    }
  }
}
