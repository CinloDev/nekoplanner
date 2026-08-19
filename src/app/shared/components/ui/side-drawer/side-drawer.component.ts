import { Component, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { ButtonComponent } from '../button/button.component';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule, A11yModule, ButtonComponent, LucideAngularModule],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.scss'
})
export class SideDrawerComponent {
  readonly title = input.required<string>();
  readonly close = output<void>();

  readonly XIcon = X;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.close.emit();
  }

  onBackdropClick() {
    this.close.emit();
  }
}
