import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDistribution } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-status-distribution',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="status-card">
      <section aria-labelledby="status-title">
        <div class="section-header">
          <div>
            <h2 id="status-title">Estado</h2>
            <p>Cómo se encuentra tu contenido.</p>
          </div>
        </div>

        @if (hasData()) {
          <div class="status-list">
            @for (item of data(); track item.label) {
              <article class="status-item">
                <div class="status-main">
                  <span
                    class="status-dot"
                    [class]="'status-dot status-dot--' + getStatusType(item.label)"
                    aria-hidden="true"
                  ></span>

                  <div class="status-copy">
                    <span class="status-label">
                      {{ item.label }}
                    </span>

                    <span class="status-percentage">
                      {{ item.percentage | number:'1.0-0' }}%
                    </span>
                  </div>
                </div>

                <div class="status-value">
                  <span class="status-count">
                    {{ item.count }}
                  </span>
                  <span class="status-unit">
                    {{ item.count === 1 ? 'publicación' : 'publicaciones' }}
                  </span>
                </div>

                <div
                  class="progress-track"
                  role="progressbar"
                  [attr.aria-label]="
                    item.label + ': ' +
                    item.percentage.toFixed(0) +
                    '%'
                  "
                  [attr.aria-valuenow]="item.percentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="progress-fill"
                    [class]="'progress-fill progress-fill--' + getStatusType(item.label)"
                    [style.width.%]="item.percentage"
                  ></div>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="empty-state">
            <span>0 publicaciones</span>
          </div>
        }
      </section>
    </app-card>
  `,
  styles: [`
    .status-card {
      width: 100%;
      height: 100%;
    }

    section {
      padding: var(--spacing-5);
    }

    .section-header {
      margin-bottom: var(--spacing-4);
    }

    .section-header h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-tight);
    }

    .section-header p {
      margin: var(--spacing-1) 0 0;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .status-item {
      display: grid;
      grid-template-columns: minmax(140px, 1fr) auto;
      gap: var(--spacing-3);
      padding: var(--spacing-3) 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .status-item:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .status-item:first-child {
      padding-top: 0;
    }

    .status-main {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      min-width: 0;
    }

    .status-dot {
      width: 9px;
      height: 9px;
      flex: 0 0 9px;
      border-radius: var(--radius-full);
    }

    .status-dot--published {
      background: var(--color-success);
    }

    .status-dot--scheduled {
      background: var(--color-info);
    }

    .status-dot--draft {
      background: var(--color-warning);
    }

    .status-dot--idea {
      background: var(--color-text-muted);
    }

    .status-dot--archived {
      background: var(--color-border-strong);
    }

    .status-copy {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-2);
      min-width: 0;
    }

    .status-label {
      overflow: hidden;
      color: var(--color-text-main);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-percentage {
      flex: 0 0 auto;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .status-value {
      display: flex;
      align-items: baseline;
      justify-content: flex-end;
      gap: var(--spacing-1);
      white-space: nowrap;
    }

    .status-count {
      color: var(--color-text-main);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-tight);
    }

    .status-unit {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .progress-track {
      grid-column: 1 / -1;
      width: 100%;
      height: 4px;
      overflow: hidden;
      background: var(--color-surface-hover);
      border-radius: var(--radius-full);
    }

    .progress-fill {
      width: 0;
      height: 100%;
      border-radius: inherit;
      transition: width 0.25s ease;
    }

    .progress-fill--published {
      background: var(--color-success);
    }

    .progress-fill--scheduled {
      background: var(--color-info);
    }

    .progress-fill--draft {
      background: var(--color-warning);
    }

    .progress-fill--idea {
      background: var(--color-text-muted);
    }

    .progress-fill--archived {
      background: var(--color-border-strong);
    }

    .empty-state {
      min-height: 120px;
      display: grid;
      place-items: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    @media (max-width: 639px) {
      section {
        padding: var(--spacing-4);
      }

      .status-item {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .status-copy {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }

      .status-unit {
        display: none;
      }
    }
  `]
})
export class StatusDistributionComponent {
  data = input.required<AnalyticsDistribution[]>();

  hasData = computed(() =>
    this.data().some(item => item.count > 0)
  );

  getStatusType(
    label: string
  ): 'published' | 'scheduled' | 'draft' | 'idea' | 'archived' | 'default' {
    const normalized = label.toLowerCase();

    if (normalized.includes('publicada')) return 'published';
    if (normalized.includes('programada')) return 'scheduled';
    if (normalized.includes('borrador')) return 'draft';
    if (normalized.includes('idea')) return 'idea';
    if (normalized.includes('archivada')) return 'archived';

    return 'default';
  }
}