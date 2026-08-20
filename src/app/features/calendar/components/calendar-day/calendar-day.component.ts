import { Component, Input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, Platform } from '@core/models';
import { isCurrentMonth, isSameDay } from '@core/utils/calendar';
import { isSameWeek } from 'date-fns';
import { PLATFORM_META } from '@core/config/platforms.config';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.scss'
})
export class CalendarDayComponent {
  @Input({ required: true }) date!: Date;
  @Input({ required: true }) referenceMonth!: Date;
  @Input({ required: true }) today!: Date;
  @Input() posts: Post[] = [];
  @Input() isSelected = false;

  readonly daySelected = output<Date>();

  readonly displayIcons = computed(() => {
    return this.posts.slice(0, 3).map(post => ({
      id: post.id,
      platform: post.platform,
      icon: PLATFORM_META[post.platform! || 'other']?.icon
    }));
  });

  readonly extraCount = computed(() => {
    return this.posts.length > 3 ? this.posts.length - 3 : 0;
  });

  readonly isOtherMonth = computed(() => {
    return !isCurrentMonth(this.date, this.referenceMonth);
  });

  readonly isToday = computed(() => {
    return isSameDay(this.date, this.today);
  });

  readonly isCurrentWeek = computed(() => {
    return isSameWeek(this.date, this.today, { weekStartsOn: 1 });
  });

  readonly isWeekend = computed(() => {
    const day = this.date.getDay();
    return day === 0 || day === 6;
  });

  get dayNumber(): number {
    return this.date.getDate();
  }

  onDayClick() {
    this.daySelected.emit(this.date);
  }
}
