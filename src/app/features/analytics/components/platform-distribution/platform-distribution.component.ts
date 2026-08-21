import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDistribution } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { PLATFORM_META } from '@core/config/platforms.config';
import { LucideAngularModule, Globe } from 'lucide-angular';

@Component({
  selector: 'app-platform-distribution',
  standalone: true,
  imports: [CommonModule, CardComponent, LucideAngularModule],
  template: `
    <app-card class="platform-card">
      <section aria-labelledby="platform-title">
        <div class="section-header">
          <div>
            <h2 id="platform-title">Plataformas</h2>
            <p>Distribución de publicaciones.</p>
          </div>
        </div>

        @if (hasData()) {
          <div class="distribution-list">
            @for (item of data(); track item.label) {
              <article class="distribution-item">
                <div class="item-row">
                  <div class="item-brand">
                    <div class="brand-icon" aria-hidden="true">
                      @if (getPlatformIcon(item.label); as iconUrl) {
                        <img
                          [src]="iconUrl"
                          alt=""
                          width="16"
                          height="16"
                        />
                      } @else {
                        <lucide-icon
                          [img]="Globe"
                          [size]="16"
                        />
                      }
                    </div>

                    <span class="brand-label">
                      {{ item.label }}
                    </span>
                  </div>

                  <div class="item-value">
                    <strong>{{ item.percentage | number:'1.0-0' }}%</strong>
                    <span>{{ item.count }}</span>
                  </div>
                </div>

                <div
                  class="progress-track"
                  role="progressbar"
                  [attr.aria-label]="'Publicaciones en ' + item.label"
                  [attr.aria-valuenow]="item.percentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="progress-fill"
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
    .platform-card {
      width: 100%;
      height: 100%;
    }

    section {
      /* padding removed to prevent double padding with app-card */
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

    .distribution-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .distribution-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-3);
      min-width: 0;
    }

    .item-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      min-width: 0;
      color: var(--color-text-main);
    }

    .brand-icon {
      width: 28px;
      height: 28px;
      flex: 0 0 28px;

      display: grid;
      place-items: center;

      color: var(--color-primary);
      background: var(--color-primary-muted);
      border-radius: var(--radius-md);
    }

    .brand-icon img {
      display: block;
      object-fit: contain;
    }

    .brand-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .item-value {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-2);
      flex: 0 0 auto;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      white-space: nowrap;
    }

    .item-value strong {
      color: var(--color-text-main);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .progress-track {
      width: 100%;
      height: 6px;
      overflow: hidden;
      background: var(--color-surface-hover);
      border-radius: var(--radius-full);
    }

    .progress-fill {
      width: 0;
      height: 100%;
      background: var(--color-primary);
      border-radius: inherit;
      transition: width 0.25s ease;
    }

    .distribution-item:hover .progress-fill {
      background: var(--color-primary-hover);
    }

    .empty-state {
      min-height: 120px;
      display: grid;
      place-items: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    @media (max-width: 639px) {
      .distribution-list {
        gap: var(--spacing-3);
      }

      .brand-icon {
        width: 26px;
        height: 26px;
        flex-basis: 26px;
      }
    }
  `]
})
export class PlatformDistributionComponent {
  data = input.required<AnalyticsDistribution[]>();

  readonly Globe = Globe;

  hasData = computed(() =>
    this.data().some(item => item.count > 0)
  );

  getPlatformIcon(label: string): string | null {
    const meta = Object.values(PLATFORM_META).find(
      platform => platform.label === label
    );

    return meta?.icon ?? null;
  }
}