import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, CardComponent],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss'
})
export class DesignSystemComponent {
  toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}
