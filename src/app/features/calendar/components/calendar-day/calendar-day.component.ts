import { Component, Input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Post } from '../../../../core/models';
import { CalendarPostComponent } from '../calendar-post/calendar-post.component';
import { isCurrentMonth, isSameDay } from '../../../../core/utils/calendar';
import { isSameWeek } from 'date-fns';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule, DragDropModule, CalendarPostComponent],
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

  readonly postDropped = output<{ post: Post, targetDate: Date }>();

  onDrop(event: CdkDragDrop<Date>) {
    const post = event.item.data as Post;
    const targetDate = event.container.data as Date;
    this.postDropped.emit({ post, targetDate });
  }
}
