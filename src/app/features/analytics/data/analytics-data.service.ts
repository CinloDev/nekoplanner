import { Injectable, computed, inject } from '@angular/core';
import { AppStateService } from '@core/state/app-state.service';
import { Post } from '@core/models';
import { AnalyticsDistribution, AnalyticsMonthlyPoint, ContentFlowStage } from '../models/analytics.model';
import { subMonths, format, parseISO, isValid, startOfMonth, isAfter, isBefore, endOfMonth } from 'date-fns';
import { PLATFORM_META } from '@core/config/platforms.config';

/**
 * Returns the effective date for analytics purposes based on the post's status.
 * - published -> updatedAt (fallback until publishedAt is added to the domain)
 * - scheduled -> scheduledDate
 * - draft/idea -> scheduledDate (if it exists)
 * - archived -> excluded (returns null)
 */
export function getAnalyticsDate(post: Post): Date | null {
  if (post.status === 'archived') {
    return null;
  }
  
  if (post.status === 'published') {
    const date = parseISO(post.updatedAt);
    return isValid(date) ? date : null;
  }
  
  if (post.scheduledDate) {
    const date = parseISO(post.scheduledDate);
    return isValid(date) ? date : null;
  }
  
  return null;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDataService {
  private readonly appState = inject(AppStateService);

  readonly postsByPlatform = computed<AnalyticsDistribution[]>(() => {
    const dist = this.appState.platformDistribution();
    return dist.map(d => ({
      label: PLATFORM_META[d.platform]?.label || d.platform,
      count: d.count,
      percentage: d.percentage
    }));
  });

  readonly postsByStatus = computed<AnalyticsDistribution[]>(() => {
    const dist = this.appState.statusDistribution();
    const statusLabels: Record<string, string> = {
      idea: 'Idea',
      draft: 'Borrador',
      scheduled: 'Programada',
      published: 'Publicada',
      archived: 'Archivada'
    };
    
    return dist.map(d => ({
      label: statusLabels[d.status] || d.status,
      count: d.count,
      percentage: d.percentage
    }));
  });

  readonly completedPosts = computed<number>(() => {
    return this.appState.posts().filter(post => post.status === 'published').length;
  });

  readonly contentFlow = computed<AnalyticsDistribution[]>(() => {
    const posts = this.appState.posts();
    let backlog = 0;
    let pipeline = 0;
    let completed = 0;

    posts.forEach(post => {
      if (post.status === 'idea' || post.status === 'draft') {
        backlog++;
      } else if (post.status === 'scheduled') {
        pipeline++;
      } else if (post.status === 'published') {
        completed++;
      }
    });

    const total = backlog + pipeline + completed; // total relevant for flow (excluding archived)

    return [
      { label: 'Backlog', count: backlog, percentage: total > 0 ? (backlog / total) * 100 : 0 },
      { label: 'Pipeline', count: pipeline, percentage: total > 0 ? (pipeline / total) * 100 : 0 },
      { label: 'Completed', count: completed, percentage: total > 0 ? (completed / total) * 100 : 0 }
    ];
  });

  readonly postsByMonth = computed<AnalyticsMonthlyPoint[]>(() => {
    const posts = this.appState.posts();
    const result: AnalyticsMonthlyPoint[] = [];
    const now = new Date();
    
    // Generate the last 6 months chronologically (oldest first)
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const monthLabel = format(monthDate, 'MMM yyyy'); // e.g., 'Aug 2026'
      
      let count = 0;
      posts.forEach(post => {
        const date = getAnalyticsDate(post);
        if (date && date >= start && date <= end) {
          count++;
        }
      });
      
      result.push({
        month: monthLabel,
        count
      });
    }
    
    return result;
  });
}
