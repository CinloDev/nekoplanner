import { Component, input } from '@angular/core';
import { CardComponent } from '@shared/components/ui/card/card.component';
import {
  LucideAngularModule,
  BarChart3,
  CheckCircle2,
  CalendarClock,
  Percent,
} from 'lucide-angular';

@Component({
  selector: 'app-analytics-kpi-card',
  standalone: true,
  imports: [CardComponent, LucideAngularModule],
  template: `
    <app-card class="kpi-card" [class]="'kpi-card kpi-card--' + variant()">
      <div class="kpi-top">
        <div class="kpi-icon" aria-hidden="true">
          @switch (variant()) {
            @case ('primary') {
              <lucide-icon [img]="BarChart3" [size]="18" />
            }
            @case ('success') {
              <lucide-icon [img]="CheckCircle2" [size]="18" />
            }
            @case ('info') {
              <lucide-icon [img]="CalendarClock" [size]="18" />
            }
            @case ('warning') {
              <lucide-icon [img]="Percent" [size]="18" />
            }
          }
        </div>

        <span class="kpi-label" [id]="'kpi-label-' + label()">
          {{ label() }}
        </span>
      </div>

      <div class="kpi-main">
        <p
          class="kpi-value"
          [attr.aria-labelledby]="'kpi-label-' + label()"
        >
          {{ value() }}
        </p>

        @if (description()) {
          <span class="kpi-description">
            {{ description() }}
          </span>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .kpi-card {
      --kpi-accent: var(--color-primary);
      --kpi-accent-muted: var(--color-primary-muted);

      height: 100%;
      min-height: 132px;
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacing-4);

      background: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }

    .kpi-card:hover {
      border-color: var(--color-border-strong);
      box-shadow: var(--shadow-md);
    }

    .kpi-top {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      min-width: 0;
    }

    .kpi-icon {
      width: 32px;
      height: 32px;
      flex: 0 0 32px;

      display: grid;
      place-items: center;

      color: var(--kpi-accent);
      background: var(--kpi-accent-muted);
      border-radius: var(--radius-md);
    }

    .kpi-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      margin: 0;

      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      line-height: var(--line-height-tight);
    }

    .kpi-main {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-2);
      min-width: 0;
    }

    .kpi-value {
      margin: 0;

      color: var(--color-text-main);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-none);
      letter-spacing: -0.02em;
    }

    .kpi-description {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    .kpi-card--primary {
      --kpi-accent: var(--color-primary);
      --kpi-accent-muted: var(--color-primary-muted);
    }

    .kpi-card--success {
      --kpi-accent: var(--color-success);
      --kpi-accent-muted: var(--color-success-muted);
    }

    .kpi-card--info {
      --kpi-accent: var(--color-info);
      --kpi-accent-muted: var(--color-info-muted);
    }

    .kpi-card--warning {
      --kpi-accent: var(--color-warning);
      --kpi-accent-muted: var(--color-warning-muted);
    }

    @media (max-width: 639px) {
      .kpi-card {
        min-height: 116px;
        padding: var(--spacing-3);
      }

      .kpi-value {
        font-size: var(--font-size-2xl);
      }

      .kpi-icon {
        width: 30px;
        height: 30px;
        flex-basis: 30px;
      }
    }
  `]
})
export class AnalyticsKpiCardComponent {
  label = input.required<string>();
  value = input.required<number | string>();
  description = input<string>('');
  variant = input<'primary' | 'success' | 'info' | 'warning'>('primary');

  readonly BarChart3 = BarChart3;
  readonly CheckCircle2 = CheckCircle2;
  readonly CalendarClock = CalendarClock;
  readonly Percent = Percent;
}