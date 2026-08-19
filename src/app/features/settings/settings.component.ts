import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ThemeService } from '../../core/services/theme.service';
import { DataExportService } from '../../core/services/data-export.service';
import { ThemePreference } from '../../core/models/settings.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardComponent, SelectComponent, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  private readonly dataExportService = inject(DataExportService);

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

  exportData(): void {
    this.dataExportService.export();
  }
}
