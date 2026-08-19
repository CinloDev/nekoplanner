import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDistribution } from '../../models/analytics.model';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-content-flow',
  standalone: true,
  imports: [CommonModule, CardComponent, LucideAngularModule],
  template: `
    <app-card class="h-full w-full">
      <section aria-labelledby="flow-title" class="p-6">
        <h2 id="flow-title" class="text-lg font-semibold mb-6 text-primary">Content Flow</h2>
        
        <div class="flow-container">
          @for (stage of data(); track stage.label; let i = $index) {
            <div class="flow-node" [class.is-empty]="stage.count === 0">
              <div class="node-header">
                <span class="node-label">{{ stage.label }}</span>
              </div>
              <div class="node-body">
                <span class="node-count">{{ stage.count }}</span>
                <span class="node-percentage">{{ stage.percentage | number:'1.0-0' }}%</span>
              </div>
            </div>
            
            @if (i < data().length - 1) {
              <div class="flow-connector" aria-hidden="true">
                <lucide-icon [img]="ChevronRight" size="24" class="text-muted"></lucide-icon>
              </div>
            }
          }
        </div>
      </section>
    </app-card>
  `,
  styles: [`
    .flow-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-4);
      width: 100%;
    }
    .flow-node {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }
    .flow-node:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }
    .flow-node.is-empty {
      opacity: 0.7;
    }
    .node-header {
      margin-bottom: var(--spacing-2);
    }
    .node-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .node-body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .node-count {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .node-percentage {
      font-size: var(--font-size-sm);
      color: var(--color-primary);
      font-weight: 600;
      background-color: var(--color-primary-muted);
      padding: 2px 8px;
      border-radius: 100px;
      margin-top: var(--spacing-1);
    }
    .flow-connector {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-border-strong);
      flex-shrink: 0;
    }

    /* Mobile handling */
    @media (max-width: 768px) {
      .flow-container {
        flex-direction: column;
      }
      .flow-node {
        width: 100%;
      }
      .flow-connector {
        transform: rotate(90deg);
        margin: var(--spacing-2) 0;
      }
    }
  `]
})
export class ContentFlowComponent {
  data = input.required<AnalyticsDistribution[]>();
  readonly ChevronRight = ChevronRight;
}
