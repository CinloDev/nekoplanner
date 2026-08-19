import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { AppStateService } from '@core/state/app-state.service';
import { PLATFORM_META } from '@core/config/platforms.config';

import { UpcomingPostCardComponent } from './components/upcoming-post-card/upcoming-post-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent, UpcomingPostCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly appState = inject(AppStateService);
  readonly platformMeta = PLATFORM_META;

  readonly upcomingPosts = computed(() => {
    const posts = [...this.appState.posts()];
    return posts
      .filter(post => post.status === 'scheduled')
      .sort((a, b) => {
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      })
      .slice(0, 5);
  });

  readonly platformDistribution = computed(() => {
    return this.appState.platformDistribution()
      .map(item => ({
        ...item,
        meta: PLATFORM_META[item.platform] || { label: item.platform, color: 'var(--color-text-muted)' }
      }))
      .sort((a, b) => b.count - a.count);
  });

  readonly statusDistribution = computed(() => {
    return this.appState.statusDistribution()
      .map(item => {
        let label: string = item.status;
        let color = 'var(--color-text-muted)';
        if (item.status === 'published') { label = 'Publicadas'; color = 'var(--color-success)'; }
        if (item.status === 'scheduled') { label = 'Programadas'; color = 'var(--color-primary)'; }
        if (item.status === 'draft') { label = 'Borradores'; color = 'var(--color-warning)'; }
        if (item.status === 'idea') { label = 'Ideas'; color = 'var(--color-info)'; }
        if (item.status === 'archived') { label = 'Archivadas'; color = 'var(--color-text-muted)'; }

        return {
          ...item,
          label,
          color
        };
      })
      .sort((a, b) => b.count - a.count);
  });
}
