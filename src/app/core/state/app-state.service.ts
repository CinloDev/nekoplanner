import { Injectable, computed, signal } from '@angular/core';
import { Post, Idea, Settings, Platform, PostStatus, PlatformDistribution, StatusDistribution } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // --- Private Writable Signals ---
  private readonly _posts = signal<Post[]>([]);
  private readonly _ideas = signal<Idea[]>([]);
  private readonly _settings = signal<Settings>({
    theme: 'system',
    navigation: 'sidebar'
  });

  private readonly _selectedPlatform = signal<Platform | null>(null);
  private readonly _selectedStatus = signal<PostStatus | null>(null);
  private readonly _searchQuery = signal<string>('');
  private readonly _currentDate = signal<string>(new Date().toISOString());

  // --- Public Readonly Signals ---
  readonly posts = this._posts.asReadonly();
  readonly ideas = this._ideas.asReadonly();
  readonly settings = this._settings.asReadonly();
  
  readonly selectedPlatform = this._selectedPlatform.asReadonly();
  readonly selectedStatus = this._selectedStatus.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly currentDate = this._currentDate.asReadonly();

  // --- Derived State (Computed) ---
  readonly filteredPosts = computed(() => {
    const allPosts = this.posts();
    const platform = this.selectedPlatform();
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase().trim();

    return allPosts.filter(post => {
      const matchPlatform = platform ? post.platform === platform : true;
      const matchStatus = status ? post.status === status : true;
      const matchQuery = query 
        ? post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
        : true;
      
      return matchPlatform && matchStatus && matchQuery;
    });
  });

  readonly filteredIdeas = computed(() => {
    const allIdeas = this.ideas();
    const query = this.searchQuery().toLowerCase().trim();

    return allIdeas.filter(idea => {
      const matchQuery = query 
        ? idea.title.toLowerCase().includes(query) || idea.content.toLowerCase().includes(query)
        : true;
        
      return matchQuery;
    });
  });

  readonly postCounts = computed(() => {
    const allPosts = this.posts();
    return {
      total: allPosts.length,
      idea: allPosts.filter(p => p.status === 'idea').length,
      draft: allPosts.filter(p => p.status === 'draft').length,
      scheduled: allPosts.filter(p => p.status === 'scheduled').length,
      published: allPosts.filter(p => p.status === 'published').length,
      archived: allPosts.filter(p => p.status === 'archived').length,
    };
  });

  readonly ideasCount = computed(() => this.ideas().length);

  readonly postsThisMonth = computed(() => {
    const currentDateStr = this.currentDate();
    if (!currentDateStr) return 0;
    
    const currentDateObj = new Date(currentDateStr);
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();

    return this.posts().filter(post => {
      if (!post.scheduledDate) return false;
      const scheduledDateObj = new Date(post.scheduledDate);
      return scheduledDateObj.getFullYear() === currentYear && scheduledDateObj.getMonth() === currentMonth;
    }).length;
  });

  readonly platformDistribution = computed<PlatformDistribution[]>(() => {
    const posts = this.posts();
    const total = posts.length;
    const distribution: Record<string, number> = {};

    posts.forEach(post => {
      const p = post.platform || 'other';
      distribution[p] = (distribution[p] || 0) + 1;
    });

    return Object.entries(distribution).map(([platform, count]) => ({
      platform: platform as Platform,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  });

  readonly statusDistribution = computed<StatusDistribution[]>(() => {
    const posts = this.posts();
    const total = posts.length;
    
    // Initialize with all possible statuses to ensure they are always present
    const distribution: Record<PostStatus, number> = {
      idea: 0,
      draft: 0,
      scheduled: 0,
      published: 0,
      archived: 0
    };

    posts.forEach(post => {
      if (post.status && distribution[post.status] !== undefined) {
        distribution[post.status]++;
      }
    });

    return Object.entries(distribution).map(([status, count]) => ({
      status: status as PostStatus,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0
    }));
  });

  // --- Modifiers ---
  setPosts(posts: Post[]): void {
    this._posts.set(posts);
  }

  setIdeas(ideas: Idea[]): void {
    this._ideas.set(ideas);
  }

  updatePostScheduledDate(postId: string, newDateIso: string): void {
    const posts = this._posts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;
    
    const post = posts[postIndex];
    if (!post.scheduledDate) return; // Ignore if it doesn't have an original scheduledDate

    const originalDate = new Date(post.scheduledDate);
    const targetDate = new Date(newDateIso);

    // Create a new date that merges the target date's YYYY-MM-DD 
    // with the original date's local hours, minutes, seconds and ms.
    const mergedDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      originalDate.getHours(),
      originalDate.getMinutes(),
      originalDate.getSeconds(),
      originalDate.getMilliseconds()
    );

    const updatedPost: Post = {
      ...post,
      scheduledDate: mergedDate.toISOString()
    };

    const newPosts = [...posts];
    newPosts[postIndex] = updatedPost;
    
    this._posts.set(newPosts);
  }

  setSelectedPlatform(platform: Platform | null): void {
    this._selectedPlatform.set(platform);
  }

  setSelectedStatus(status: PostStatus | null): void {
    this._selectedStatus.set(status);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  setCurrentDate(date: string): void {
    this._currentDate.set(date);
  }

  updateSettings(settings: Settings): void {
    this._settings.set(settings);
  }
}
