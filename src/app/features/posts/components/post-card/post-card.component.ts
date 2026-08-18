import { Component, input, output, computed } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Post, PostStatus } from '../../../../core/models';
import { PLATFORM_META } from '../../../../core/config/platforms.config';
import { LucideAngularModule, Image as ImageIcon, Edit as EditIcon, Trash2 as TrashIcon, Copy as CopyIcon } from 'lucide-angular';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe, CommonModule, CardComponent, BadgeComponent, ButtonComponent, LucideAngularModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly variant = input<'grid' | 'list'>('grid');

  readonly duplicate = output<Post>();
  readonly edit = output<void>();
  readonly delete = output<Post>();

  readonly PLATFORM_META = PLATFORM_META;
  readonly ImageIcon = ImageIcon;
  readonly EditIcon = EditIcon;
  readonly TrashIcon = TrashIcon;
  readonly CopyIcon = CopyIcon;
  
  readonly STATUS_LABELS: Record<PostStatus, string> = {
    idea: 'Idea',
    draft: 'Borrador',
    scheduled: 'Programada',
    published: 'Publicada',
    archived: 'Archivada'
  };

  readonly displayTags = computed(() => {
    const tags = this.post().tags || [];
    const max = 3;
    if (tags.length <= max) {
      return { visible: tags, extraCount: 0 };
    }
    return {
      visible: tags.slice(0, max),
      extraCount: tags.length - max
    };
  });
}
