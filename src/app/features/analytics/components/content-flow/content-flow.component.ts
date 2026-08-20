import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDistribution } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-content-flow',
  standalone: true,
  imports: [CommonModule, CardComponent, LucideAngularModule],
  template: `
    <app-card class="flow-card">
      <section aria-labelledby="flow-title">
        <div class="flow-header">
          <div>
            <h2 id="flow-title">Content Flow</h2>
            <p>Cómo avanza tu contenido por el pipeline.</p>
          </div>
        </div>

        <div class="flow-container">
          @for (stage of data(); track stage.label; let i = $index) {
            <div
              class="flow-stage"
              [class.is-empty]="stage.count === 0"
              [class.is-active]="stage.count > 0"
              [class.stage-backlog]="getStageType(stage.label) === 'backlog'"
              [class.stage-pipeline]="getStageType(stage.label) === 'pipeline'"
              [class.stage-completed]="getStageType(stage.label) === 'completed'"
            >
              <div class="stage-indicator" aria-hidden="true"></div>

              <span class="stage-label">
                {{ stage.label }}
              </span>

              <span class="stage-count">
                {{ stage.count }}
              </span>

              <span class="stage-percentage">
                {{ stage.percentage | number:'1.0-0' }}%
              </span>
            </div>

            @if (i < data().length - 1) {
              <div class="flow-connector" aria-hidden="true">
                <span></span>
                <lucide-icon
                  [img]="ArrowRight"
                  [size]="16"
                />
              </div>
            }
          }
        </div>
      </section>
    </app-card>
  `,
  styles: [`
    .flow-card {
      width: 100%;
      height: 100%;
    }

    section {
      width: 100%;
      padding: var(--spacing-5);
    }

    .flow-header {
      margin-bottom: var(--spacing-5);
    }

    .flow-header h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-tight);
    }

    .flow-header p {
      margin: var(--spacing-1) 0 0;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    .flow-container {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .flow-stage {
      --stage-color: var(--color-text-muted);
      --stage-bg: var(--color-surface-hover);

      position: relative;
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-1);

      text-align: center;
    }

    .stage-indicator {
      width: 8px;
      height: 8px;
      margin-bottom: var(--spacing-1);
      border-radius: var(--radius-full);
      background: var(--stage-color);
    }

    .stage-label {
      max-width: 100%;
      overflow: hidden;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      line-height: var(--line-height-tight);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stage-count {
      color: var(--color-text-main);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-none);
    }

    .stage-percentage {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    .stage-backlog {
      --stage-color: var(--color-warning);
    }

    .stage-pipeline {
      --stage-color: var(--color-info);
    }

    .stage-completed {
      --stage-color: var(--color-success);
    }

    .flow-stage.is-empty {
      .stage-indicator {
        background: var(--color-border-strong);
      }

      .stage-count {
        color: var(--color-text-muted);
      }
    }

    .flow-connector {
      display: flex;
      flex: 0 0 clamp(32px, 8vw, 72px);
      align-items: center;
      gap: 0;
      color: var(--color-border-strong);
    }

    .flow-connector span {
      flex: 1;
      height: 1px;
      background: var(--color-border-subtle);
    }

    .flow-connector lucide-icon {
      flex: 0 0 auto;
    }

    @media (max-width: 639px) {
      section {
        padding: var(--spacing-4);
      }

      .flow-header {
        margin-bottom: var(--spacing-4);
      }

      .flow-container {
        gap: var(--spacing-2);
      }

      .stage-label {
        font-size: var(--font-size-xs);
      }

      .stage-count {
        font-size: var(--font-size-xl);
      }

      .flow-connector {
        flex-basis: 24px;
      }
    }
  `]
})
export class ContentFlowComponent {
  data = input.required<AnalyticsDistribution[]>();

  readonly ArrowRight = ArrowRight;

  getStageType(label: string): 'backlog' | 'pipeline' | 'completed' | 'unknown' {
    const normalized = label.toLowerCase();

    if (normalized.includes('backlog')) {
      return 'backlog';
    }

    if (normalized.includes('pipeline')) {
      return 'pipeline';
    }

    if (normalized.includes('completed')) {
      return 'completed';
    }

    return 'unknown';
  }
}