import { Component, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { ButtonComponent } from '../button/button.component';
import { LucideAngularModule, AlertTriangle, Info } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, A11yModule, ButtonComponent, LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly isOpen = input(false);
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmText = input('Confirmar');
  readonly cancelText = input('Cancelar');
  readonly isDestructive = input(true);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    if (this.isOpen()) {
      this.cancel.emit();
    }
  }

  onBackdropClick() {
    this.cancel.emit();
  }

  onDialogClick(event: MouseEvent) {
    // Prevent backdrop click from triggering when clicking inside the dialog
    event.stopPropagation();
  }

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
