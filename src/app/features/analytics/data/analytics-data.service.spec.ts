import { TestBed } from '@angular/core/testing';
import { AnalyticsDataService, getAnalyticsDate } from './analytics-data.service';
import { AppStateService } from '@core/state/app-state.service';
import { signal } from '@angular/core';
import { Post, Platform, PostStatus } from '@core/models';
import { subMonths, startOfMonth, format, addDays } from 'date-fns';

describe('AnalyticsDataService', () => {
  let service: AnalyticsDataService;
  let mockAppState: any;
  let postsSignal: any;

  beforeEach(() => {
    postsSignal = signal<Post[]>([]);

    mockAppState = {
      posts: postsSignal,
      platformDistribution: jasmine.createSpy('platformDistribution').and.callFake(() => {
        const posts = postsSignal();
        if (posts.length === 0) return [];
        // simple mock implementation of platformDistribution
        const countMap: Record<string, number> = {};
        posts.forEach((p: Post) => {
          countMap[p.platform] = (countMap[p.platform] || 0) + 1;
        });
        return Object.entries(countMap).map(([platform, count]) => ({
          platform, count, percentage: (count / posts.length) * 100
        }));
      }),
      statusDistribution: jasmine.createSpy('statusDistribution').and.callFake(() => {
        const posts = postsSignal();
        if (posts.length === 0) {
          return ['idea', 'draft', 'scheduled', 'published', 'archived'].map(s => ({
            status: s, count: 0, percentage: 0
          }));
        }
        const countMap: Record<string, number> = {
          idea: 0, draft: 0, scheduled: 0, published: 0, archived: 0
        };
        posts.forEach((p: Post) => countMap[p.status]++);
        return Object.entries(countMap).map(([status, count]) => ({
          status, count, percentage: (count / posts.length) * 100
        }));
      })
    };

    TestBed.configureTestingModule({
      providers: [
        AnalyticsDataService,
        { provide: AppStateService, useValue: mockAppState }
      ]
    });
    service = TestBed.inject(AnalyticsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAnalyticsDate', () => {
    it('should return null for archived posts', () => {
      const post = { status: 'archived', updatedAt: '2026-08-01T00:00:00Z' } as Post;
      expect(getAnalyticsDate(post)).toBeNull();
    });

    it('should return updatedAt for published posts', () => {
      const post = { status: 'published', updatedAt: '2026-08-01T00:00:00Z' } as Post;
      const date = getAnalyticsDate(post);
      expect(date).toBeTruthy();
      expect(date?.toISOString()).toBe('2026-08-01T00:00:00.000Z');
    });

    it('should return scheduledDate for scheduled posts', () => {
      const post = { status: 'scheduled', scheduledDate: '2026-08-10T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' } as Post;
      const date = getAnalyticsDate(post);
      expect(date).toBeTruthy();
      expect(date?.toISOString()).toBe('2026-08-10T00:00:00.000Z');
    });

    it('should return scheduledDate for draft posts if exists', () => {
      const post = { status: 'draft', scheduledDate: '2026-08-15T00:00:00Z' } as Post;
      const date = getAnalyticsDate(post);
      expect(date).toBeTruthy();
      expect(date?.toISOString()).toBe('2026-08-15T00:00:00.000Z');
    });

    it('should return null for draft posts without scheduledDate', () => {
      const post = { status: 'draft' } as Post;
      expect(getAnalyticsDate(post)).toBeNull();
    });
  });

  describe('postsByPlatform', () => {
    it('should handle empty dataset', () => {
      postsSignal.set([]);
      const dist = service.postsByPlatform();
      expect(dist.length).toBe(0);
    });

    it('should map platform distributions correctly', () => {
      postsSignal.set([
        { platform: 'x' } as Post,
        { platform: 'x' } as Post,
        { platform: 'instagram' } as Post
      ]);
      const dist = service.postsByPlatform();
      expect(dist.length).toBe(2);
      
      const xDist = dist.find(d => d.label === 'X'); // From PLATFORM_META
      expect(xDist?.count).toBe(2);
      
      const igDist = dist.find(d => d.label === 'Instagram');
      expect(igDist?.count).toBe(1);
    });
  });

  describe('postsByStatus', () => {
    it('should handle empty dataset', () => {
      postsSignal.set([]);
      const dist = service.postsByStatus();
      expect(dist.length).toBe(5);
      dist.forEach(d => {
        expect(d.count).toBe(0);
        expect(d.percentage).toBe(0);
      });
    });

    it('should map status distributions correctly', () => {
      postsSignal.set([
        { status: 'published' } as Post,
        { status: 'published' } as Post,
        { status: 'draft' } as Post
      ]);
      const dist = service.postsByStatus();
      
      const pubDist = dist.find(d => d.label === 'Publicada');
      expect(pubDist?.count).toBe(2);
      
      const draftDist = dist.find(d => d.label === 'Borrador');
      expect(draftDist?.count).toBe(1);
    });
  });

  describe('completedPosts', () => {
    it('should return 0 for empty dataset', () => {
      postsSignal.set([]);
      expect(service.completedPosts()).toBe(0);
    });

    it('should count only published posts', () => {
      postsSignal.set([
        { status: 'published' } as Post,
        { status: 'draft' } as Post,
        { status: 'scheduled' } as Post,
        { status: 'archived' } as Post,
      ]);
      expect(service.completedPosts()).toBe(1);
    });
  });

  describe('contentFlow', () => {
    it('should handle empty dataset', () => {
      postsSignal.set([]);
      const flow = service.contentFlow();
      expect(flow.length).toBe(3); // Backlog, Pipeline, Completed
      flow.forEach(f => {
        expect(f.count).toBe(0);
        expect(f.percentage).toBe(0); // Protect against NaN
      });
    });

    it('should calculate funnel metrics and exclude archived', () => {
      postsSignal.set([
        { status: 'idea' } as Post,
        { status: 'draft' } as Post,
        { status: 'scheduled' } as Post,
        { status: 'published' } as Post,
        { status: 'published' } as Post,
        { status: 'archived' } as Post, // should be excluded
      ]);
      
      const flow = service.contentFlow();
      
      const backlog = flow.find(f => f.label === 'Backlog');
      expect(backlog?.count).toBe(2);
      expect(backlog?.percentage).toBe(40); // 2 out of 5 relevant posts
      
      const pipeline = flow.find(f => f.label === 'Pipeline');
      expect(pipeline?.count).toBe(1);
      expect(pipeline?.percentage).toBe(20);
      
      const completed = flow.find(f => f.label === 'Completed');
      expect(completed?.count).toBe(2);
      expect(completed?.percentage).toBe(40);
    });
  });

  describe('postsByMonth', () => {
    it('should return 6 months in chronological order with empty dataset', () => {
      postsSignal.set([]);
      const series = service.postsByMonth();
      
      expect(series.length).toBe(6);
      
      const now = new Date();
      // Oldest month
      expect(series[0].month).toBe(format(subMonths(now, 5), 'MMM yyyy'));
      // Current month
      expect(series[5].month).toBe(format(now, 'MMM yyyy'));
      
      series.forEach(s => expect(s.count).toBe(0));
    });

    it('should correctly count posts in various months and handle year crossover', () => {
      const now = new Date();
      const currentMonth = startOfMonth(now);
      const lastMonth = startOfMonth(subMonths(now, 1));
      const fiveMonthsAgo = startOfMonth(subMonths(now, 5));
      const sevenMonthsAgo = startOfMonth(subMonths(now, 7)); // outside range
      
      postsSignal.set([
        // Published post in current month
        { status: 'published', updatedAt: currentMonth.toISOString() } as Post,
        // Scheduled post in current month
        { status: 'scheduled', scheduledDate: addDays(currentMonth, 2).toISOString() } as Post,
        // Draft in last month
        { status: 'draft', scheduledDate: lastMonth.toISOString() } as Post,
        // Published post 5 months ago
        { status: 'published', updatedAt: fiveMonthsAgo.toISOString() } as Post,
        // Published post 7 months ago (should not be counted)
        { status: 'published', updatedAt: sevenMonthsAgo.toISOString() } as Post,
        // Post without valid date (should not be counted)
        { status: 'idea' } as Post
      ]);

      const series = service.postsByMonth();
      
      expect(series.length).toBe(6);
      
      // 5 months ago (index 0)
      expect(series[0].count).toBe(1);
      
      // 1 month ago (index 4)
      expect(series[4].count).toBe(1);
      
      // Current month (index 5)
      expect(series[5].count).toBe(2);
      
      // Other months should be 0
      expect(series[1].count).toBe(0);
      expect(series[2].count).toBe(0);
      expect(series[3].count).toBe(0);
    });
  });

  describe('Reactivity', () => {
    it('should update computed values automatically when postsSignal changes', () => {
      // Start empty
      postsSignal.set([]);
      expect(service.completedPosts()).toBe(0);
      
      // Update signal
      postsSignal.set([
        { status: 'published' } as Post,
      ]);
      
      // Computed should reflect change immediately
      expect(service.completedPosts()).toBe(1);
    });
  });
});
