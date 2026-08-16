import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'calendar', 
        loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent)
      },
      { 
        path: 'posts', 
        loadComponent: () => import('./features/posts/posts.component').then(m => m.PostsComponent)
      },
      { 
        path: 'ideas', 
        loadComponent: () => import('./features/ideas/ideas.component').then(m => m.IdeasComponent)
      },
      { 
        path: 'analytics', 
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
