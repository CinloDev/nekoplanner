import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Post } from '@core/models';
import { PLATFORM_META } from '@core/config/platforms.config';
import { formatCalendarDate } from '@core/utils/calendar';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-calendar-post',
  standalone: true,
  imports: [CommonModule, DragDropModule, BadgeComponent],
  templateUrl: './calendar-post.component.html',
  styleUrl: './calendar-post.component.scss'
})
export class CalendarPostComponent {
  @Input({ required: true }) post!: Post;

  readonly platformMeta = computed(() => {
    return PLATFORM_META[this.post.platform];
  });

  readonly time = computed(() => {
    if (!this.post.scheduledDate) return '';
    return formatCalendarDate(this.post.scheduledDate, 'HH:mm');
  });

  get statusColor(): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    switch (this.post.status) {
      case 'published': return 'success';
      case 'scheduled': return 'info';
      case 'draft': return 'warning';
      case 'idea': return 'primary';
      case 'archived': return 'primary';
      default: return 'primary';
    }
  }

  get statusLabel(): string {
    const labels: Record<string, string> = {
      published: 'Publicado',
      scheduled: 'Programado',
      draft: 'Borrador',
      idea: 'Idea',
      archived: 'Archivado'
    };
    return labels[this.post.status] || this.post.status;
  }
}
