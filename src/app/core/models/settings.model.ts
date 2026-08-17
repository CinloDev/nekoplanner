export type ThemePreference = 'light' | 'dark' | 'system';
export type NavigationPreference = 'sidebar' | 'drawer';

export interface Settings {
  theme: ThemePreference;
  navigation: NavigationPreference;
}
