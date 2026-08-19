import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../state/app-state.service';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from './theme.service';
import { StorageKeys } from '../storage/storage-keys';
import { NekoPlannerBackup } from '../models/backup.model';

export type ImportResult =
  | { success: true; backup: NekoPlannerBackup }
  | { success: false; error: string };

@Injectable({
  providedIn: 'root'
})
export class DataImportService {
  private readonly appState = inject(AppStateService);
  private readonly storage = inject(StorageService);
  private readonly themeService = inject(ThemeService);

  async parseAndValidate(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      let parsed: unknown;

      try {
        parsed = JSON.parse(text);
      } catch (e) {
        return { success: false, error: 'El archivo no contiene un JSON válido.' };
      }

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, error: 'El backup no tiene una estructura válida.' };
      }

      const backup = parsed as Partial<NekoPlannerBackup>;

      // Version validation
      if (backup.version !== 1) {
        return { success: false, error: 'La versión del backup no es compatible.' };
      }

      // ExportedAt validation
      if (typeof backup.exportedAt !== 'string' || isNaN(Date.parse(backup.exportedAt))) {
        return { success: false, error: 'El backup no tiene un timestamp válido de exportación.' };
      }

      // Arrays existence
      if (!Array.isArray(backup.posts) || !Array.isArray(backup.ideas)) {
        return { success: false, error: 'El backup no tiene listas de publicaciones o ideas válidas.' };
      }

      // Settings existence
      if (!backup.settings || typeof backup.settings !== 'object') {
        return { success: false, error: 'El backup carece de configuraciones (Settings).' };
      }

      // Duplicate IDs tracking
      const seenIds = new Set<string>();

      // Posts validation
      for (const post of backup.posts) {
        if (!post.id || !post.title || !post.platform || !post.status) {
          return { success: false, error: 'El backup contiene publicaciones con estructura inválida.' };
        }
        if (seenIds.has(post.id)) {
          return { success: false, error: 'El backup contiene IDs duplicados.' };
        }
        seenIds.add(post.id);
      }

      // Ideas validation
      for (const idea of backup.ideas) {
        if (!idea.id || !idea.title) {
          return { success: false, error: 'El backup contiene ideas con estructura inválida.' };
        }
        if (seenIds.has(idea.id)) {
          return { success: false, error: 'El backup contiene IDs duplicados entre ideas y publicaciones.' };
        }
        seenIds.add(idea.id);
      }

      // Settings validation
      if (!['light', 'dark', 'system'].includes(backup.settings.theme as string)) {
        return { success: false, error: 'El tema (theme) especificado en los ajustes del backup es inválido.' };
      }
      if (!['sidebar', 'drawer'].includes(backup.settings.navigation as string)) {
        return { success: false, error: 'La navegación especificada en los ajustes del backup es inválida.' };
      }

      // Final cast after all checks pass
      return { success: true, backup: backup as NekoPlannerBackup };
    } catch (e) {
      return { success: false, error: 'No se pudo leer el archivo.' };
    }
  }

  import(backup: NekoPlannerBackup): void {
    // 1. Atomic state update
    this.appState.importData(backup);

    // 2. Persist cleanly
    this.storage.save(StorageKeys.POSTS, backup.posts);
    this.storage.save(StorageKeys.IDEAS, backup.ideas);
    this.storage.save(StorageKeys.SETTINGS, backup.settings);

    // 3. Inform ThemeService to re-evaluate based on the newly imported settings.
    this.themeService.recalculateTheme();
  }
}
