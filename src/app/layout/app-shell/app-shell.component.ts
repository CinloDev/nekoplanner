import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MobileNavigationComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
}
