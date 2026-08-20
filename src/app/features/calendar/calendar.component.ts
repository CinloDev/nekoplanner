import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '@core/state/app-state.service';
import { StorageService } from '@core/storage/storage.service';
import { StorageKeys } from '@core/storage/storage-keys';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarGridComponent } from './components/calendar-grid/calendar-grid.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { InputComponent } from '@shared/components/ui/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { getMonthDays, getPreviousMonth, getNextMonth, getToday, formatCalendarDate } from '@core/utils/calendar';
import { Post, Platform, PostStatus } from '@core/models';
import { PLATFORM_META } from '@core/config/platforms.config';
import { PostCardComponent } from '@features/posts/components/post-card/post-card.component';
import { isSameDay } from 'date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarHeaderComponent, CalendarGridComponent, CalendarDayComponent, InputComponent, SelectComponent, ButtonComponent, PostCardComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private readonly appState = inject(AppStateService);
  private readonly storageService = inject(StorageService);

  readonly currentMonth = signal<Date>(getToday());
  readonly todayDate = getToday();
  readonly selectedDate = signal<Date | null>(null);

  // Filters state
  readonly selectedPlatform = signal<Platform | null>(null);
  readonly selectedStatus = signal<PostStatus | null>(null);
  readonly searchQuery = signal<string>('');

  // Options for UI
  readonly platformOptions: SelectOption<Platform>[] = (Object.keys(PLATFORM_META) as Platform[]).map(key => ({
    label: PLATFORM_META[key].label,
    value: key
  }));

  readonly statusOptions: SelectOption<PostStatus>[] = [
    { value: 'idea', label: 'Idea' },
    { value: 'draft', label: 'Borrador' },
    { value: 'scheduled', label: 'Programada' },
    { value: 'published', label: 'Publicada' },
    { value: 'archived', label: 'Archivada' }
  ];

  readonly calendarDays = computed(() => {
    return getMonthDays(this.currentMonth());
  });

  readonly calendarPosts = computed(() => {
    return this.appState.posts()
      .filter(p => !!p.scheduledDate)
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  });

  readonly filteredPosts = computed(() => {
    let posts = this.calendarPosts();
    const platform = this.selectedPlatform();
    const status = this.selectedStatus();
    const search = this.searchQuery().trim().toLowerCase();

    if (platform) {
      posts = posts.filter(p => p.platform === platform);
    }
    
    if (status) {
      posts = posts.filter(p => p.status === status);
    }

    if (search) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.content.toLowerCase().includes(search)
      );
    }

    return posts;
  });

  readonly postsByDay = computed(() => {
    const map = new Map<string, Post[]>();
    const posts = this.filteredPosts();
    
    for (const post of posts) {
      const dayKey = formatCalendarDate(post.scheduledDate!, 'yyyy-MM-dd');
      
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(post);
    }
    
    return map;
  });

  readonly selectedDayPosts = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return [];
    
    return this.filteredPosts()
      .filter(p => p.scheduledDate && isSameDay(new Date(p.scheduledDate), selected))
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  });

  readonly gridData = computed(() => {
    const days = this.calendarDays();
    const postsMap = this.postsByDay();
    
    return days.map(date => {
      const key = formatCalendarDate(date, 'yyyy-MM-dd');
      return {
        date,
        posts: postsMap.get(key) || []
      };
    });
  });

  get hasAnyPosts(): boolean {
    return this.calendarPosts().length > 0;
  }

  goToPreviousMonth() {
    this.currentMonth.set(getPreviousMonth(this.currentMonth()));
  }

  goToNextMonth() {
    this.currentMonth.set(getNextMonth(this.currentMonth()));
  }

  goToToday() {
    this.currentMonth.set(getToday());
  }

  get isAnyFilterActive(): boolean {
    return this.selectedPlatform() !== null || 
           this.selectedStatus() !== null || 
           this.searchQuery().trim() !== '';
  }

  clearFilters() {
    this.selectedPlatform.set(null);
    this.selectedStatus.set(null);
    this.searchQuery.set('');
  }

  onDaySelected(date: Date) {
    if (this.selectedDate() && isSameDay(this.selectedDate()!, date)) {
      this.selectedDate.set(null);
    } else {
      this.selectedDate.set(date);
    }
  }
}
