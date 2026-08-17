import { Injectable, computed, signal } from '@angular/core';
import { Post, Idea, Settings, Platform, PostStatus } from '../models';

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

  // --- Modifiers ---
  setPosts(posts: Post[]): void {
    this._posts.set(posts);
  }

  setIdeas(ideas: Idea[]): void {
    this._ideas.set(ideas);
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
