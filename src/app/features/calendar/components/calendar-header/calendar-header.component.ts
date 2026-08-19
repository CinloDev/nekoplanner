import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatCalendarDate } from '@core/utils/calendar';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LucideAngularModule],
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.scss'
})
export class CalendarHeaderComponent {
  @Input({ required: true }) currentMonth!: Date;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  get formattedMonth(): string {
    const formatted = formatCalendarDate(this.currentMonth, 'MMMM yyyy');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
