import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
}
