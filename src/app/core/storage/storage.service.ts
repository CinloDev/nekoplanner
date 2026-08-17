import { Injectable } from '@angular/core';
import { STORAGE_NAMESPACE } from './storage-keys';

export interface ImportResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  save<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[StorageService] Error al guardar la clave "${key}":`, error);
    }
  }

  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item) as unknown;
      return parsed as T;
    } catch (error) {
      console.error(`[StorageService] Error al cargar la clave "${key}":`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Error al remover la clave "${key}":`, error);
    }
  }

  clear(): void {
    try {
      // Creamos un array de keys a remover para evitar modificar la colección mientras iteramos
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_NAMESPACE)) {
          keysToRemove.push(key);
        }
      }
      
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('[StorageService] Error al limpiar el namespace:', error);
    }
  }

  exportData(): void {
    try {
      const exportData: Record<string, unknown> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_NAMESPACE)) {
          const value = localStorage.getItem(key);
          if (value) {
            exportData[key] = JSON.parse(value);
          }
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `nekoplanner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('[StorageService] Error al exportar los datos:', error);
    }
  }

  importData(jsonString: string): ImportResult {
    try {
      const parsed = JSON.parse(jsonString) as unknown;
      
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, error: 'Estructura JSON inválida. Se esperaba un objeto.' };
      }

      const dataObj = parsed as Record<string, unknown>;
      
      // Basic validation: ensure it has keys and at least one belongs to our namespace
      const keys = Object.keys(dataObj);
      if (keys.length === 0) {
        return { success: false, error: 'El archivo JSON está vacío.' };
      }

      let hasValidKeys = false;
      for (const key of keys) {
        if (key.startsWith(STORAGE_NAMESPACE)) {
          hasValidKeys = true;
          break;
        }
      }

      if (!hasValidKeys) {
        return { success: false, error: 'No se encontraron datos válidos de NekoPlanner en el JSON.' };
      }

      // Restore data safely
      for (const key of keys) {
        if (key.startsWith(STORAGE_NAMESPACE)) {
          this.save(key, dataObj[key]);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('[StorageService] Error al importar los datos:', error);
      return { success: false, error: 'Error al parsear el contenido JSON.' };
    }
  }
}
