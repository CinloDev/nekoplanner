import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LayoutGrid, List, FileText, Search } from 'lucide-angular';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/ui/select/select.component';
import { AppStateService } from '../../core/state/app-state.service';
import { Platform, PostStatus } from '../../core/models';
import { PLATFORM_META } from '../../core/config/platforms.config';

const STATUS_PRIORITY: Record<PostStatus, number> = {
  idea: 1,
  draft: 2,
  scheduled: 3,
  published: 4,
  archived: 5
};

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    LucideAngularModule,
    CardComponent, 
    BadgeComponent, 
    ButtonComponent, 
    InputComponent, 
    SelectComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  private readonly appState = inject(AppStateService);

  // State Signals
  readonly searchQuery = signal<string>('');
  readonly selectedPlatform = signal<Platform | null>(null);
  readonly selectedStatus = signal<PostStatus | null>(null);
  readonly sortBy = signal<'date' | 'title' | 'status'>('date');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  // Computed state
  readonly visiblePosts = computed(() => {
    let result = [...this.appState.posts()];

    const query = this.searchQuery().trim().toLowerCase();
    const platform = this.selectedPlatform();
    const status = this.selectedStatus();
    
    // Filters
    if (query || platform !== null || status !== null) {
      result = result.filter(post => {
        let matches = true;
        
        if (query) {
          const titleMatch = post.title.toLowerCase().includes(query);
          const contentMatch = post.content.toLowerCase().includes(query);
          matches = matches && (titleMatch || contentMatch);
        }
        
        if (platform !== null) {
          matches = matches && post.platform === platform;
        }
        
        if (status !== null) {
          matches = matches && post.status === status;
        }
        
        return matches;
      });
    }

    // Sorting
    const sort = this.sortBy();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      if (sort === 'date') {
        if (!a.scheduledDate && !b.scheduledDate) return 0;
        if (!a.scheduledDate) return 1; // Unscheduled always at the end
        if (!b.scheduledDate) return -1;
        
        const dateA = new Date(a.scheduledDate).getTime();
        const dateB = new Date(b.scheduledDate).getTime();
        return (dateA - dateB) * dir;
      }
      
      if (sort === 'title') {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1 * dir;
        if (titleA > titleB) return 1 * dir;
        return 0;
      }
      
      if (sort === 'status') {
        const priorityA = STATUS_PRIORITY[a.status] || 99;
        const priorityB = STATUS_PRIORITY[b.status] || 99;
        return (priorityA - priorityB) * dir;
      }
      
      return 0;
    });

    return result;
  });

  readonly hasPosts = computed(() => this.appState.posts().length > 0);

  // Options
  readonly platformOptions: SelectOption<Platform | null>[] = [
    { label: 'Todas', value: null },
    ...(Object.keys(PLATFORM_META) as Platform[]).map(key => ({
      label: PLATFORM_META[key].label,
      value: key
    }))
  ];

  readonly statusOptions: SelectOption<PostStatus | null>[] = [
    { label: 'Todos', value: null },
    { label: 'Idea', value: 'idea' },
    { label: 'Borrador', value: 'draft' },
    { label: 'Programada', value: 'scheduled' },
    { label: 'Publicada', value: 'published' },
    { label: 'Archivada', value: 'archived' }
  ];

  readonly sortOptions: SelectOption<'date' | 'title' | 'status'>[] = [
    { label: 'Fecha', value: 'date' },
    { label: 'Título', value: 'title' },
    { label: 'Estado', value: 'status' }
  ];

  readonly directionOptions: SelectOption<'asc' | 'desc'>[] = [
    { label: 'Ascendente', value: 'asc' },
    { label: 'Descendente', value: 'desc' }
  ];
  
  readonly platformMeta = PLATFORM_META;

  // Icons
  readonly LayoutGrid = LayoutGrid;
  readonly List = List;
  readonly FileText = FileText;
  readonly Search = Search;

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedPlatform.set(null);
    this.selectedStatus.set(null);
    this.sortBy.set('date');
    this.sortDirection.set('desc');
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }
}
