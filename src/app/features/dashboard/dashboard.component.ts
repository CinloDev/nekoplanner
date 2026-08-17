import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppStateService } from '../../core/state/app-state.service';
import { Platform } from '../../core/models';

export interface PlatformMeta {
  label: string;
  color: string;
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  x: { label: 'X', color: 'var(--color-text-main)' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  tiktok: { label: 'TikTok', color: '#00f2fe' },
  youtube: { label: 'YouTube', color: '#FF0000' },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, BadgeComponent, ButtonComponent],
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
