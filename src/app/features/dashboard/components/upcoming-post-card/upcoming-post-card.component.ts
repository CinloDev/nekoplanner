import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '@core/models';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';
import { PLATFORM_META } from '@core/config/platforms.config';

@Component({
  selector: 'app-upcoming-post-card',
  standalone: true,
   imports: [CommonModule, RouterModule, BadgeComponent],
  templateUrl: './upcoming-post-card.component.html',
  styleUrl: './upcoming-post-card.component.scss'
})
export class UpcomingPostCardComponent {
  post = input.required<Post>();

  readonly platformMeta = PLATFORM_META;

  readonly statusLabel = computed(() => {
    const status = this.post().status;
    switch (status) {
      case 'published': return 'Publicada';
      case 'scheduled': return 'Programada';
      case 'draft': return 'Borrador';
      case 'idea': return 'Idea';
      case 'archived': return 'Archivada';
      default: return status || '';
    }
  });

  readonly statusColor = computed(() => {
    const status = this.post().status;
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'primary';
      case 'draft': return 'warning';
      case 'idea': return 'info';
      case 'archived': return 'primary';
      default: return 'primary';
    }
  });
}
