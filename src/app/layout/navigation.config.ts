export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
  showInMobileNav?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Inicio', route: '/dashboard', showInMobileNav: true },
  { label: 'Calendario', route: '/calendar', showInMobileNav: true },
  { label: 'Publicaciones', route: '/posts', showInMobileNav: true },
  { label: 'Ideas', route: '/ideas', showInMobileNav: true },
  { label: 'Estadísticas', route: '/analytics' },
  { label: 'Ajustes', route: '/settings' }
];
