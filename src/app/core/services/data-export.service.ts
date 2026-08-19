import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../state/app-state.service';
import { NekoPlannerBackup } from '../models/backup.model';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {
  private readonly appState = inject(AppStateService);

  export(): void {
    const backup: NekoPlannerBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      posts: this.appState.posts(),
      ideas: this.appState.ideas(),
      settings: this.appState.settings()
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    if (typeof document !== 'undefined') {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neko-planner-backup.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Delay revocation to ensure browser has time to start download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 200);
    } else {
      URL.revokeObjectURL(url);
    }
  }
}
