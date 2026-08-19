import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';
import { ThemeService } from '../../core/services/theme.service';
import { DataExportService } from '../../core/services/data-export.service';
import { DataImportService } from '../../core/services/data-import.service';
import { AppStateService } from '../../core/state/app-state.service';
import { StorageService } from '../../core/storage/storage.service';
import { StorageKeys } from '../../core/storage/storage-keys';
import { ThemePreference } from '../../core/models/settings.model';
import { NekoPlannerBackup } from '../../core/models/backup.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardComponent, SelectComponent, ButtonComponent, ConfirmDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  private readonly dataExportService = inject(DataExportService);
  private readonly dataImportService = inject(DataImportService);
  private readonly appState = inject(AppStateService);
  private readonly storage = inject(StorageService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  importError: string | null = null;
  isConfirmDialogOpen = false;
  confirmMessage = '';
  pendingBackup: NekoPlannerBackup | null = null;

  isClearAllDialogOpen = false;

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

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.importError = null;
    
    const result = await this.dataImportService.parseAndValidate(file);

    // Reset input immediately so the user can select the same file again if they want
    input.value = '';

    if (!result.success) {
      this.importError = result.error;
      this.pendingBackup = null;
      return;
    }

    this.pendingBackup = result.backup;
    this.confirmMessage = `Este backup contiene:

${result.backup.posts.length} publicaciones
${result.backup.ideas.length} ideas

La importación reemplazará los datos actuales de NekoPlanner.

Esta acción no se puede deshacer.`;
    this.isConfirmDialogOpen = true;
  }

  onConfirmImport(): void {
    if (this.pendingBackup) {
      this.dataImportService.import(this.pendingBackup);
    }
    this.isConfirmDialogOpen = false;
    this.pendingBackup = null;
  }

  onCancelImport(): void {
    this.isConfirmDialogOpen = false;
    this.pendingBackup = null;
  }

  requestClearAll(): void {
    this.isClearAllDialogOpen = true;
  }

  onConfirmClearAll(): void {
    this.isClearAllDialogOpen = false;
    
    // Clear state
    this.appState.clearAllData();
    
    // Persist defaults
    this.storage.save(StorageKeys.POSTS, []);
    this.storage.save(StorageKeys.IDEAS, []);
    this.storage.save(StorageKeys.SETTINGS, this.appState.settings());
    
    // Sync theme
    this.themeService.recalculateTheme();
  }

  onCancelClearAll(): void {
    this.isClearAllDialogOpen = false;
  }
}
