import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsMonthlyPoint } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-monthly-trend',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="monthly-card">
      <section aria-labelledby="monthly-title">
        <div class="chart-header">
          <div>
            <h2 id="monthly-title">Evolución mensual</h2>
            <p>Publicaciones de los últimos 6 meses.</p>
          </div>
        </div>

        @if (points().length > 0) {
          <div class="chart-container">
            <svg
              viewBox="0 0 600 220"
              preserveAspectRatio="xMidYMid meet"
              class="chart"
              role="img"
              aria-labelledby="monthly-title"
            >
              <!-- Baseline -->
              <line
                x1="40"
                y1="170"
                x2="560"
                y2="170"
                class="axis-line"
              />

              <!-- Optional max guide -->
              @if (maxCount() > 1) {
                <line
                  x1="40"
                  y1="45"
                  x2="560"
                  y2="45"
                  class="grid-line"
                />

                <text
                  x="32"
                  y="45"
                  class="axis-label"
                  dominant-baseline="middle"
                  text-anchor="end"
                >
                  {{ maxCount() }}
                </text>
              }

              @for (pt of points(); track pt.label) {
                <!-- Hover zone -->
                <rect
                  [attr.x]="pt.x - pt.barWidth / 2 - 8"
                  y="18"
                  [attr.width]="pt.barWidth + 16"
                  height="156"
                  rx="8"
                  class="hover-zone"
                />

                <!-- Bar -->
                <rect
                  [attr.x]="pt.x - pt.barWidth / 2"
                  [attr.y]="pt.y"
                  [attr.width]="pt.barWidth"
                  [attr.height]="pt.height"
                  rx="6"
                  class="data-bar"
                >
                  <title>
                    {{ pt.label }}: {{ pt.value }} publicaciones
                  </title>
                </rect>

                <!-- Value -->
                <text
                  [attr.x]="pt.x"
                  [attr.y]="pt.value > 0 ? pt.y - 10 : 160"
                  class="bar-value"
                  text-anchor="middle"
                >
                  {{ pt.value }}
                </text>

                <!-- Month -->
                <text
                  [attr.x]="pt.x"
                  y="200"
                  class="month-label desktop-only"
                  text-anchor="middle"
                >
                  {{ pt.label }}
                </text>

                <text
                  [attr.x]="pt.x"
                  y="200"
                  class="month-label mobile-only"
                  text-anchor="middle"
                >
                  {{ pt.shortLabel }}
                </text>
              }
            </svg>
          </div>
        } @else {
          <div class="chart-empty">
            <span>No hay datos mensuales disponibles.</span>
          </div>
        }
      </section>
    </app-card>

    <div class="sr-only">
      <table>
        <caption>Datos de evolución mensual</caption>
        <thead>
          <tr>
            <th scope="col">Mes</th>
            <th scope="col">Publicaciones</th>
          </tr>
        </thead>

        <tbody>
          @for (month of sixMonthsData(); track month.month) {
            <tr>
              <td>{{ month.month }}</td>
              <td>{{ month.count }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .monthly-card {
      width: 100%;
      height: 100%;
    }

    section {
      width: 100%;
      /* padding removed to prevent double padding with app-card */
    }

    .chart-header {
      margin-bottom: var(--spacing-4);
    }

    .chart-header h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-tight);
    }

    .chart-header p {
      margin: var(--spacing-1) 0 0;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    .chart-container {
      width: 100%;
      overflow: visible;
    }

    .chart {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .axis-line {
      stroke: var(--color-border-strong);
      stroke-width: 1.25;
    }

    .grid-line {
      stroke: var(--color-border-subtle);
      stroke-width: 1;
      stroke-dasharray: 4 4;
    }

    .axis-label {
      fill: var(--color-text-muted);
      font-size: 11px;
    }

    .month-label {
      fill: var(--color-text-muted);
      font-size: 11px;
      font-weight: var(--font-weight-medium);
    }

    .bar-value {
      fill: var(--color-text-main);
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
    }

    .hover-zone {
      fill: transparent;
      transition: fill 0.18s ease;
    }

    .hover-zone:hover {
      fill: var(--color-surface-hover);
    }

    .data-bar {
      fill: var(--color-primary);
      transition:
        y 0.2s ease,
        height 0.2s ease,
        fill 0.18s ease;
    }

    .hover-zone:hover + .data-bar {
      fill: var(--color-primary-hover);
    }

    .chart-empty {
      min-height: 150px;
      display: grid;
      place-items: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      text-align: center;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }

    .mobile-only {
      display: none;
    }

    @media (max-width: 639px) {
      .desktop-only {
        display: none;
      }

      .mobile-only {
        display: inline;
      }

      .chart-header {
        margin-bottom: var(--spacing-3);
      }

      .axis-label {
        font-size: 20px;
      }

      .month-label {
        font-size: 20px;
      }

      .bar-value {
        font-size: 22px;
      }
    }
  `]
})
export class MonthlyTrendComponent {
  data = input.required<AnalyticsMonthlyPoint[]>();

  sixMonthsData = computed(() => this.data().slice(-6));

  maxCount = computed(() => {
    const max = Math.max(
      ...this.sixMonthsData().map(point => point.count),
      0
    );

    return Math.max(max, 1);
  });

  points = computed(() => {
    const data = this.sixMonthsData();

    if (data.length === 0) {
      return [];
    }

    const max = this.maxCount();

    const chartLeft = 50;
    const chartRight = 570;
    const chartTop = 45;
    const chartBottom = 170;
    const chartWidth = chartRight - chartLeft;
    const step = chartWidth / (data.length > 1 ? data.length - 1 : 1);

    return data.map((point, index) => {
      const x = chartLeft + step * index;
      const height = point.count === 0
        ? 0
        : (point.count / max) * (chartBottom - chartTop);

      const y = chartBottom - height;

      const barWidth = Math.min(
        44,
        Math.max(24, step * 0.52)
      );

      return {
        x,
        y,
        height,
        barWidth,
        value: point.count,
        label: point.month,
        shortLabel: point.month.split(' ')[0],
      };
    });
  });
}