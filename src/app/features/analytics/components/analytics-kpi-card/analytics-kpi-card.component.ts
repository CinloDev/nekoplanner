import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-analytics-kpi-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="kpi-card h-full">
      <div class="kpi-content">
        <h3 class="kpi-label" [id]="'kpi-label-' + label()">{{ label() }}</h3>
        <p class="kpi-value" [attr.aria-labelledby]="'kpi-label-' + label()">{{ value() }}</p>
      </div>
    </app-card>
  `,
  styles: [`
    .kpi-card {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-6);
    }
    .kpi-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-2);
      margin-top: 0;
    }
    .kpi-value {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1;
    }
  `]
})
export class AnalyticsKpiCardComponent {
  label = input.required<string>();
  value = input.required<number | string>();
}
