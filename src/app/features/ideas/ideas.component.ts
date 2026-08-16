import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.scss'
})
export class IdeasComponent {
}
