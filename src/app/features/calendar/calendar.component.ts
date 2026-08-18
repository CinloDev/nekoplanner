import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../core/state/app-state.service';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarGridComponent } from './components/calendar-grid/calendar-grid.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { getMonthDays, getPreviousMonth, getNextMonth, getToday, formatCalendarDate } from '../../core/utils/calendar';
import { Post } from '../../core/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarHeaderComponent, CalendarGridComponent, CalendarDayComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private readonly appState = inject(AppStateService);

  readonly currentMonth = signal<Date>(getToday());
  readonly todayDate = getToday();

  readonly calendarDays = computed(() => {
    return getMonthDays(this.currentMonth());
  });

  readonly calendarPosts = computed(() => {
    return this.appState.posts()
      .filter(p => !!p.scheduledDate)
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  });

  readonly postsByDay = computed(() => {
    const map = new Map<string, Post[]>();
    const posts = this.calendarPosts();
    
    for (const post of posts) {
      const dayKey = formatCalendarDate(post.scheduledDate!, 'yyyy-MM-dd');
      
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(post);
    }
    
    return map;
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
}
