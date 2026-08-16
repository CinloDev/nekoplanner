import { Component, HostListener } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { NAVIGATION_ITEMS } from '../navigation.config';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ButtonComponent, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  currentSection: string = 'NekoPlanner';
  isMenuOpen: boolean = false;
  navItems = NAVIGATION_ITEMS;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      const segment = url.split('/')[1];
      
      if (segment) {
        const found = this.navItems.find(item => item.route === `/${segment}`);
        this.currentSection = found ? found.label : segment;
      } else {
        this.currentSection = 'NekoPlanner';
      }
      
      this.closeMenu();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}
