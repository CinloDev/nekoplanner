import { Injectable, computed, signal, inject } from '@angular/core';
import { AppStateService } from '../state/app-state.service';
import { StorageService } from '../storage/storage.service';
import { StorageKeys } from '../storage/storage-keys';
import { Settings, ThemePreference } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly appState = inject(AppStateService);
  private readonly storage = inject(StorageService);

  private readonly _resolvedTheme = signal<'light' | 'dark'>('light');
  
  readonly preference = computed(() => this.appState.settings().theme);
  readonly resolvedTheme = this._resolvedTheme.asReadonly();
  
  private mediaQueryList: MediaQueryList | null = null;
  private mediaQueryListener = (e: MediaQueryListEvent) => {
    if (this.preference() === 'system') {
      this.updateResolvedTheme('system');
    }
  };

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryList.addEventListener('change', this.mediaQueryListener);
    }
  }

  initialize(): void {
    // 1. AppStateService.hydrate() has already populated AppState with Settings.
    // We just need to read the initial preference and resolve the theme.
    const currentSettings = this.appState.settings();
    let initialPreference: ThemePreference = currentSettings?.theme || 'system';
    
    // Validate the preference
    if (!['light', 'dark', 'system'].includes(initialPreference)) {
      initialPreference = 'system';
    }

    // 2. Resolve theme
    this.updateResolvedTheme(initialPreference);
  }

  setPreference(preference: ThemePreference): void {
    // 1. Update Settings in AppState (which automatically persists to Storage)
    const currentSettings = this.appState.settings();
    const newSettings: Settings = { ...currentSettings, theme: preference };
    this.appState.updateSettings(newSettings);

    // 2. Resolve and apply theme
    this.updateResolvedTheme(preference);
  }

  recalculateTheme(): void {
    this.updateResolvedTheme(this.preference());
  }

  private updateResolvedTheme(preference: ThemePreference): void {
    let resolved: 'light' | 'dark' = 'light';

    if (preference === 'system') {
      if (this.mediaQueryList && this.mediaQueryList.matches) {
        resolved = 'dark';
      }
    } else {
      resolved = preference;
    }

    this._resolvedTheme.set(resolved);
    this.applyThemeToDOM(resolved);
  }

  private applyThemeToDOM(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // Cleanup mainly for tests
  destroy(): void {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.mediaQueryListener);
    }
  }
}
