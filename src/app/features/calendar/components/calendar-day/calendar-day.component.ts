import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../../core/models';
import { CalendarPostComponent } from '../calendar-post/calendar-post.component';
import { isCurrentMonth, isSameDay } from '../../../../core/utils/calendar';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule, CalendarPostComponent],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.scss'
})
export class CalendarDayComponent {
  @Input({ required: true }) date!: Date;
  @Input({ required: true }) referenceMonth!: Date;
  @Input({ required: true }) today!: Date;
  @Input() posts: Post[] = [];

  readonly isOtherMonth = computed(() => {
    return !isCurrentMonth(this.date, this.referenceMonth);
  });

  readonly isToday = computed(() => {
    return isSameDay(this.date, this.today);
  });

  get dayNumber(): number {
    return this.date.getDate();
  }
}
