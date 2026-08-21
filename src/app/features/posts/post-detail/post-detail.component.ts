import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Copy, Edit, Trash2, CopyCheck, CalendarClock } from 'lucide-angular';
import { AppStateService } from '@core/state/app-state.service';
import { PostActionsService } from '@core/services/post-actions.service';
import { PLATFORM_META } from '@core/config/platforms.config';
import { Post, PostStatus } from '@core/models';
import { BadgeComponent } from '@shared/components/ui/badge/badge.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';
import { DatePickerComponent } from '@shared/components/ui/date-picker/date-picker.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { PostFormComponent, PostFormValue } from '../components/post-form/post-form.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, LucideAngularModule, BadgeComponent, ButtonComponent, CardComponent, ConfirmDialogComponent, DatePickerComponent, SelectComponent, PostFormComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly appState = inject(AppStateService);
  private readonly actions = inject(PostActionsService);

  readonly postId = this.route.snapshot.paramMap.get('id') || '';
  readonly post = computed(() => this.appState.getPostById(this.postId));
  readonly isEditing = signal(false);
  readonly showDeleteDialog = signal(false);
  readonly clipboardMessage = signal('');
  readonly dateValue = signal<string | null>(null);
  readonly platformMeta = PLATFORM_META;
  readonly statusOptions: SelectOption<PostStatus>[] = [
    { value: 'idea', label: 'Idea' }, { value: 'draft', label: 'Borrador' },
    { value: 'scheduled', label: 'Programada' }, { value: 'published', label: 'Publicada' },
    { value: 'archived', label: 'Archivada' }
  ];
  readonly statusLabels: Record<PostStatus, string> = { idea: 'Idea', draft: 'Borrador', scheduled: 'Programada', published: 'Publicada', archived: 'Archivada' };
  readonly ArrowLeft = ArrowLeft;
  readonly Copy = Copy;
  readonly CopyCheck = CopyCheck;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly CalendarClock = CalendarClock;

  platformLabel(): string {
    const platform = this.post()?.platform;
    return platform ? (this.platformMeta[platform]?.label || platform) : '';
  }

  platformIcon(): string | null {
    const platform = this.post()?.platform;
    return platform ? (this.platformMeta[platform]?.icon || null) : null;
  }

  openDatePicker(): void {
    this.dateValue.set(this.post()?.scheduledDate || null);
  }

  changeDate(value: string | null): void {
    const post = this.post();
    if (!post || !value) return;
    if (post.scheduledDate) this.actions.updateScheduledDate(post.id, value);
    else this.actions.setScheduledDate(post, value);
  }

  changeStatus(status: PostStatus | null): void {
    const post = this.post();
    if (post && status && status !== post.status) this.actions.updateStatus(post, status);
  }

  saveEdit(value: PostFormValue): void {
    const post = this.post();
    if (!post) return;
    this.actions.update(post, value);
    this.isEditing.set(false);
  }

  duplicate(): void {
    const post = this.post();
    if (post) this.actions.duplicate(post.id);
  }

  delete(): void {
    const post = this.post();
    if (!post) return;
    this.actions.delete(post.id);
    this.router.navigate(['/posts'], { replaceUrl: true });
  }

  async copyContent(): Promise<void> {
    const content = this.post()?.content || '';
    if (!content) {
      this.clipboardMessage.set('No hay contenido para copiar.');
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
        document.body.removeChild(textarea);
      }
      this.clipboardMessage.set('Contenido copiado.');
    } catch {
      this.clipboardMessage.set('No se pudo copiar el contenido.');
    }
  }
}
