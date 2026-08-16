import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Calendar, FileText, Settings } from 'lucide-angular';

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './mobile-navigation.component.html',
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly Settings = Settings;
}
