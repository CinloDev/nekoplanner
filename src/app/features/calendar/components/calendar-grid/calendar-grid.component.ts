import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss'
})
export class CalendarGridComponent {
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
}
