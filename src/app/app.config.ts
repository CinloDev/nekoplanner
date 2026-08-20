import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { ThemeService } from './core/services/theme.service';

import { AppStateService } from './core/state/app-state.service';

registerLocaleData(localeEs, 'es');

function initializeApp(appState: AppStateService, themeService: ThemeService) {
  return () => {
    appState.hydrate();
    themeService.initialize();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppStateService, ThemeService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
