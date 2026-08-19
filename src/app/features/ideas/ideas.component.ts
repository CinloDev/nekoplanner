import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '@core/state/app-state.service';
import { StorageService } from '@core/storage/storage.service';
import { StorageKeys } from '@core/storage/storage-keys';
import { Idea } from '@core/models';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputComponent } from '@shared/components/ui/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/ui/select/select.component';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';
import { SideDrawerComponent } from '@shared/components/ui/side-drawer/side-drawer.component';
import { IdeaCardComponent } from './components/idea-card/idea-card.component';
import { IdeaFormComponent, IdeaFormValue } from './components/idea-form/idea-form.component';
import { LucideAngularModule, Search as SearchIcon, X as XIcon, Plus as PlusIcon, Lightbulb as IdeaIcon } from 'lucide-angular';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonComponent, 
    InputComponent, 
    SelectComponent, 
    ConfirmDialogComponent,
    SideDrawerComponent,
    IdeaCardComponent,
    IdeaFormComponent,
    LucideAngularModule
  ],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.scss'
})
export class IdeasComponent {
  private readonly appState = inject(AppStateService);
  private readonly storageService = inject(StorageService);

  readonly SearchIcon = SearchIcon;
  readonly XIcon = XIcon;
  readonly PlusIcon = PlusIcon;
  readonly IdeaIcon = IdeaIcon;

  // Local state
  readonly searchQuery = signal<string>('');
  readonly selectedTag = signal<string | null>(null);
  
  readonly isFormOpen = signal<boolean>(false);
  readonly editingIdea = signal<Idea | null>(null);
  readonly ideaToDelete = signal<Idea | null>(null);

  // Computed data
  readonly allIdeas = this.appState.ideas;

  readonly tagOptions = computed<SelectOption<string>[]>(() => {
    const ideas = this.allIdeas();
    const uniqueTags = new Set<string>();
    
    ideas.forEach(idea => {
      idea.tags?.forEach(tag => {
        uniqueTags.add(tag.name);
      });
    });

    const options: SelectOption<string>[] = Array.from(uniqueTags).map(tagName => ({
      value: tagName,
      label: tagName
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label));
  });

  readonly visibleIdeas = computed(() => {
    let ideas = this.allIdeas();
    const query = this.searchQuery().trim().toLowerCase();
    const tag = this.selectedTag();

    if (query) {
      ideas = ideas.filter(idea => 
        idea.title.toLowerCase().includes(query) || 
        idea.content.toLowerCase().includes(query)
      );
    }

    if (tag) {
      ideas = ideas.filter(idea => 
        idea.tags?.some(t => t.name === tag)
      );
    }

    // Sort by updatedAt descending
    return [...ideas].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });

  get hasIdeas(): boolean {
    return this.allIdeas().length > 0;
  }

  get isAnyFilterActive(): boolean {
    return this.searchQuery().trim() !== '' || this.selectedTag() !== null;
  }

  // Actions
  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedTag.set(null);
  }

  openCreateForm(): void {
    this.editingIdea.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(idea: Idea): void {
    this.editingIdea.set(idea);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingIdea.set(null);
  }

  saveIdea(formValue: IdeaFormValue): void {
    const now = new Date().toISOString();
    const currentIdea = this.editingIdea();

    if (currentIdea) {
      const updatedIdea: Idea = {
        ...currentIdea,
        title: formValue.title,
        content: formValue.content,
        tags: formValue.tags,
        updatedAt: now
      };
      this.appState.updateIdea(updatedIdea);
    } else {
      const newIdea: Idea = {
        id: crypto.randomUUID(),
        title: formValue.title,
        content: formValue.content,
        tags: formValue.tags,
        createdAt: now,
        updatedAt: now
      };
      this.appState.createIdea(newIdea);
    }

    this.persistIdeas();
    this.closeForm();
  }

  requestDelete(idea: Idea): void {
    this.ideaToDelete.set(idea);
  }

  cancelDelete(): void {
    this.ideaToDelete.set(null);
  }

  confirmDelete(): void {
    const idea = this.ideaToDelete();
    if (idea) {
      this.appState.deleteIdea(idea.id);
      this.persistIdeas();
    }
    this.ideaToDelete.set(null);
  }

  private persistIdeas(): void {
    this.storageService.save(StorageKeys.IDEAS, this.allIdeas());
  }
}
