import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'solid' | 'outline' | 'subtle';
export type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'subtle';
  @Input() color: BadgeColor = 'primary';

  get classes(): string {
    return `badge badge-${this.variant} badge-color-${this.color}`;
  }
}
