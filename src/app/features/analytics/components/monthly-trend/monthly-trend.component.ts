import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsMonthlyPoint } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-monthly-trend',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="h-full w-full">
      <section aria-labelledby="monthly-title" class="p-6">
        <h2 id="monthly-title" class="text-lg font-semibold mb-4 text-primary">Evolución mensual</h2>
        
        <div class="chart-container">
          <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" class="w-full h-auto" role="img" aria-label="Gráfico de línea de evolución mensual">
            <!-- Grid lines -->
            @for (line of gridLines(); track line) {
              <line x1="40" [attr.y1]="line.y" x2="580" [attr.y2]="line.y" class="grid-line" />
              <text x="30" [attr.y]="line.y" class="grid-text" dominant-baseline="middle" text-anchor="end">{{ line.value }}</text>
            }

            <!-- Trend Line -->
            <path [attr.d]="linePath()" class="trend-line" fill="none" />
            
            <!-- Area under line -->
            <path [attr.d]="areaPath()" class="trend-area" />

            <!-- Points and X-axis Labels -->
            @for (pt of points(); track pt.label; let i = $index) {
              <!-- X axis label -->
              <text [attr.x]="pt.x" y="280" class="x-label" text-anchor="middle">{{ pt.label }}</text>
              
              <!-- Data point -->
              <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="6" class="data-point">
                <title>{{ pt.label }}: {{ pt.value }} publicaciones</title>
              </circle>
            }
          </svg>
        </div>
      </section>
    </app-card>
  `,
  styles: [`
    .chart-container {
      width: 100%;
    }
    .grid-line {
      stroke: var(--border-color, var(--color-border-subtle, #CBDAD7));
      stroke-width: 1;
      stroke-dasharray: 4;
    }
    .grid-text {
      font-size: 12px;
      fill: var(--text-muted);
    }
    .x-label {
      font-size: 12px;
      fill: var(--text-secondary);
      font-weight: 500;
    }
    .trend-line {
      stroke: var(--color-primary);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .trend-area {
      fill: var(--color-primary);
      opacity: 0.1;
    }
    .data-point {
      fill: var(--color-surface, #fff);
      stroke: var(--color-primary);
      stroke-width: 2;
      transition: r 0.2s ease, fill 0.2s ease;
      cursor: pointer;
    }
    .data-point:hover {
      r: 8;
      fill: var(--color-primary);
    }
  `]
})
export class MonthlyTrendComponent {
  data = input.required<AnalyticsMonthlyPoint[]>();

  maxCount = computed(() => {
    const max = Math.max(...this.data().map(d => d.count));
    return max > 0 ? max : 10; // default to 10 if all 0 to maintain grid
  });

  gridLines = computed(() => {
    const max = this.maxCount();
    // 3 grid lines (0, half, max)
    const mid = Math.ceil(max / 2);
    return [
      { value: max, y: 20 },
      { value: mid, y: 130 },
      { value: 0, y: 240 }
    ];
  });

  points = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    
    const max = this.maxCount();
    const xStep = 540 / Math.max(1, data.length - 1);
    
    return data.map((d, i) => {
      const x = 40 + (i * xStep);
      // y ranges from 240 (0) to 20 (max)
      const y = 240 - ((d.count / max) * 220);
      
      return {
        x,
        y,
        value: d.count,
        label: d.month
      };
    });
  });

  linePath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  areaPath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    const line = this.linePath();
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    return `${line} L ${lastX} 240 L ${firstX} 240 Z`;
  });
}
