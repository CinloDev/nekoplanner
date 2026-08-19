import { Component, input, output, computed } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { Idea } from '@core/models';
import { LucideAngularModule, Edit as EditIcon, Trash2 as TrashIcon, Lightbulb as IdeaIcon, ArrowRight as ArrowRightIcon, CheckCircle as CheckCircleIcon } from 'lucide-angular';

@Component({
  selector: 'app-idea-card',
  standalone: true,
  imports: [DatePipe, CommonModule, CardComponent, ButtonComponent, LucideAngularModule],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss'
})
export class IdeaCardComponent {
  readonly idea = input.required<Idea>();

  readonly edit = output<Idea>();
  readonly delete = output<Idea>();
  readonly convert = output<Idea>();

  readonly EditIcon = EditIcon;
  readonly TrashIcon = TrashIcon;
  readonly IdeaIcon = IdeaIcon;
  readonly ArrowRightIcon = ArrowRightIcon;
  readonly CheckCircleIcon = CheckCircleIcon;
  
  readonly displayTags = computed(() => {
    const tags = this.idea().tags || [];
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
