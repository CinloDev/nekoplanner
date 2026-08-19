import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { ThemeService } from '../../core/services/theme.service';
import { ThemePreference } from '../../core/models/settings.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardComponent, SelectComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);

  readonly themeOptions: SelectOption<ThemePreference>[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ];

  onThemeChange(preference: ThemePreference | null): void {
    if (preference) {
      this.themeService.setPreference(preference);
    }
  }
}
