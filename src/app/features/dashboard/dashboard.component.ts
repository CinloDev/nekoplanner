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
    const posts = this.appState.posts();
    const distribution: Record<string, number> = {};
    let total = 0;

    posts.forEach(post => {
      const p = post.platform || 'other';
      distribution[p] = (distribution[p] || 0) + 1;
      total++;
    });

    return Object.entries(distribution)
      .map(([platform, count]) => ({
        platform,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        meta: PLATFORM_META[platform] || { label: platform, color: 'var(--color-text-muted)' }
      }))
      .sort((a, b) => b.count - a.count);
  });

  readonly statusDistribution = computed(() => {
    const posts = this.appState.posts();
    const distribution: Record<string, number> = {};
    let total = 0;

    posts.forEach(post => {
      const s = post.status || 'idea';
      distribution[s] = (distribution[s] || 0) + 1;
      total++;
    });

    return Object.entries(distribution)
      .map(([status, count]) => {
        let label = status;
        let color = 'var(--color-text-muted)';
        if (status === 'published') { label = 'Publicadas'; color = 'var(--color-success)'; }
        if (status === 'scheduled') { label = 'Programadas'; color = 'var(--color-primary)'; }
        if (status === 'draft') { label = 'Borradores'; color = 'var(--color-warning)'; }
        if (status === 'idea') { label = 'Ideas'; color = 'var(--color-info)'; }
        if (status === 'archived') { label = 'Archivadas'; color = 'var(--color-text-muted)'; }

        return {
          status,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
          label,
          color
        };
      })
      .sort((a, b) => b.count - a.count);
  });
}
