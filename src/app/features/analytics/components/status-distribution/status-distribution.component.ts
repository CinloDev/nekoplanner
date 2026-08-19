import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDistribution } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-status-distribution',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="h-full">
      <section aria-labelledby="status-title" class="p-6">
        <h2 id="status-title" class="text-lg font-semibold mb-4 text-primary">Estado</h2>
        
        @if (hasData()) {
          <div class="chart-container">
            <svg [attr.viewBox]="viewBox()" preserveAspectRatio="xMinYMin meet" class="w-full h-auto" role="img" aria-label="Gráfico de barras de estados">
              @for (item of data(); track item.label; let i = $index) {
                <!-- Label -->
                <text x="0" [attr.y]="i * 35 + 16" class="label-text" dominant-baseline="middle">{{ item.label }}</text>
                
                <!-- Background Bar -->
                <rect class="bar-bg" x="100" [attr.y]="i * 35 + 6" width="150" height="20" rx="4" />
                
                <!-- Fill Bar -->
                <rect [style.fill]="getColor(item.label)" x="100" [attr.y]="i * 35 + 6" [attr.width]="getBarWidth(item.percentage)" height="20" rx="4" class="bar-fill" />
                
                <!-- Value -->
                <text x="260" [attr.y]="i * 35 + 16" class="value-text" dominant-baseline="middle">
                  {{ item.count }} ({{ item.percentage | number:'1.0-0' }}%)
                </text>
              }
            </svg>
          </div>
        } @else {
          <div class="empty-state">
            <p>0 publicaciones</p>
          </div>
        }
      </section>
    </app-card>
  `,
  styles: [`
    .chart-container {
      width: 100%;
    }
    .label-text {
      font-size: 12px;
      fill: var(--text-secondary);
      font-weight: 500;
    }
    .value-text {
      font-size: 12px;
      fill: var(--text-primary);
      font-weight: 600;
    }
    .bar-bg {
      fill: var(--bg-secondary);
    }
    .bar-fill {
      transition: width 0.3s ease;
    }
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }
  `]
})
export class StatusDistributionComponent {
  data = input.required<AnalyticsDistribution[]>();

  hasData = computed(() => {
    return this.data().some(d => d.count > 0);
  });

  viewBox = computed(() => {
    const height = Math.max(this.data().length * 35, 35);
    return `0 0 350 ${height}`;
  });

  getBarWidth(percentage: number): number {
    return (percentage / 100) * 150;
  }

  getColor(label: string): string {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('publicada')) return 'var(--color-success)';
    if (lowerLabel.includes('programada')) return 'var(--color-primary)';
    if (lowerLabel.includes('borrador')) return 'var(--color-warning)';
    if (lowerLabel.includes('idea')) return 'var(--color-info)';
    if (lowerLabel.includes('archivada')) return 'var(--color-text-muted)';
    return 'var(--color-primary)';
  }
}
