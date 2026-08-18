import { Component, ElementRef, HostListener, computed, input, output, signal, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { 
  getMonthDays, 
  getPreviousMonth, 
  getNextMonth, 
  isSameDay, 
  isCurrentMonth, 
  formatCalendarDate,
  getToday
} from '../../../../core/utils/calendar/calendar.utils';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  label = input<string>('');
  placeholder = input<string>('Seleccionar fecha y hora');
  value = input<string | null>(null);
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string | null>();

  // State
  isOpen = signal<boolean>(false);
  currentMonth = signal<Date>(getToday());
  
  // Selected state
  selectedDate = signal<Date | null>(null);
  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);

  // Time options
  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = [0, 15, 30, 45];
  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  // Icons
  CalendarIcon = Calendar;
  ChevronLeftIcon = ChevronLeft;
  ChevronRightIcon = ChevronRight;
  XIcon = X;

  // Computed
  days = computed(() => getMonthDays(this.currentMonth()));
  
  monthYearLabel = computed(() => {
    const formatted = formatCalendarDate(this.currentMonth(), 'MMMM yyyy');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  displayValue = computed(() => {
    const val = this.value();
    if (!val) return null;
    const d = new Date(val);
    return formatCalendarDate(d, 'd MMM yyyy · HH:mm');
  });

  constructor(private elementRef: ElementRef) {
    effect(() => {
      const val = this.value();
      if (val) {
        const d = new Date(val);
        this.selectedDate.set(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
        this.selectedHour.set(d.getHours());
        this.selectedMinute.set(d.getMinutes());
        // Sync currentMonth so popup opens on the selected month
        this.currentMonth.set(new Date(d.getFullYear(), d.getMonth(), 1));
      } else {
        this.selectedDate.set(null);
        const today = getToday();
        this.selectedHour.set(12); // Default hour when no date
        this.selectedMinute.set(0);
        this.currentMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
      }
    }, { allowSignalWrites: true });
  }

  toggleOpen(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  clear(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.valueChange.emit(null);
    this.close();
  }

  previousMonth(event: Event): void {
    event.stopPropagation();
    this.currentMonth.update(date => getPreviousMonth(date));
  }

  nextMonth(event: Event): void {
    event.stopPropagation();
    this.currentMonth.update(date => getNextMonth(date));
  }

  selectDay(day: Date): void {
    this.selectedDate.set(day);
    this.emitValue();
  }

  setHour(hour: number): void {
    this.selectedHour.set(hour);
    if (this.selectedDate()) {
      this.emitValue();
    }
  }

  setMinute(minute: number): void {
    this.selectedMinute.set(minute);
    if (this.selectedDate()) {
      this.emitValue();
    }
  }

  isDaySelected(day: Date): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;
    return isSameDay(day, selected);
  }

  isDayCurrentMonth(day: Date): boolean {
    return isCurrentMonth(day, this.currentMonth());
  }

  isToday(day: Date): boolean {
    return isSameDay(day, getToday());
  }

  getAriaLabel(day: Date): string {
    return formatCalendarDate(day, 'PPPP');
  }

  private emitValue(): void {
    const date = this.selectedDate();
    if (!date) return;
    
    // Create new Date combining selected day, hour, and minute in local timezone
    const combined = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      this.selectedHour(),
      this.selectedMinute(),
      0,
      0
    );
    
    this.valueChange.emit(combined.toISOString());
  }

  // A11y and UX Handlers
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    
    if (event.key === 'Escape' && this.isOpen()) {
      this.isOpen.set(false);
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
