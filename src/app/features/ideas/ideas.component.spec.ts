import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeasComponent } from './ideas.component';
import { AppStateService } from '@core/state/app-state.service';
import { StorageService } from '@core/storage/storage.service';
import { signal } from '@angular/core';
import { Idea } from '@core/models';

describe('IdeasComponent', () => {
  let component: IdeasComponent;
  let fixture: ComponentFixture<IdeasComponent>;
  let mockAppState: any;
  let mockStorageService: any;
  let ideasSignal: any;

  beforeEach(async () => {
    const initialIdeas: Idea[] = [
      { id: '1', title: 'Idea One', content: 'Content 1', createdAt: '2026-08-10', updatedAt: '2026-08-10', tags: [{ id: 't1', name: 'Angular' }] },
      { id: '2', title: 'Idea Two', content: 'Content 2', createdAt: '2026-08-11', updatedAt: '2026-08-11', tags: [{ id: 't2', name: 'React' }] },
      { id: '3', title: 'Another One', content: 'Content 3', createdAt: '2026-08-12', updatedAt: '2026-08-12', tags: [] }
    ];
    ideasSignal = signal(initialIdeas);

    mockAppState = {
      ideas: ideasSignal,
      createIdea: jasmine.createSpy('createIdea'),
      updateIdea: jasmine.createSpy('updateIdea'),
      deleteIdea: jasmine.createSpy('deleteIdea'),
      createPost: jasmine.createSpy('createPost'),
      markIdeaAsConverted: jasmine.createSpy('markIdeaAsConverted'),
      posts: jasmine.createSpy('posts').and.returnValue([])
    };

    mockStorageService = {
      save: jasmine.createSpy('save')
    };

    await TestBed.configureTestingModule({
      imports: [IdeasComponent],
      providers: [
        { provide: AppStateService, useValue: mockAppState },
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('visibleIdeas', () => {
    it('should return all ideas initially sorted by updatedAt desc', () => {
      const visible = component.visibleIdeas();
      expect(visible.length).toBe(3);
      expect(visible[0].id).toBe('3'); // 08-12
      expect(visible[1].id).toBe('2'); // 08-11
      expect(visible[2].id).toBe('1'); // 08-10
    });

    it('should filter by search query (title)', () => {
      component.searchQuery.set('Two');
      const visible = component.visibleIdeas();
      expect(visible.length).toBe(1);
      expect(visible[0].id).toBe('2');
    });

    it('should filter by search query (content)', () => {
      component.searchQuery.set('content 3');
      const visible = component.visibleIdeas();
      expect(visible.length).toBe(1);
      expect(visible[0].id).toBe('3');
    });

    it('should filter by selected tag', () => {
      component.selectedTag.set('Angular');
      const visible = component.visibleIdeas();
      expect(visible.length).toBe(1);
      expect(visible[0].id).toBe('1');
    });

    it('should combine search and tag filters', () => {
      component.searchQuery.set('Idea');
      component.selectedTag.set('React');
      const visible = component.visibleIdeas();
      expect(visible.length).toBe(1);
      expect(visible[0].id).toBe('2');
    });
  });

  describe('tagOptions', () => {
    it('should extract unique tags from ideas', () => {
      const options = component.tagOptions();
      expect(options.length).toBe(2);
      // Sorted alphabetically
      expect(options[0].value).toBe('Angular');
      expect(options[1].value).toBe('React');
    });
  });

  describe('Actions', () => {
    it('should clear filters', () => {
      component.searchQuery.set('test');
      component.selectedTag.set('Angular');
      
      component.clearFilters();
      
      expect(component.searchQuery()).toBe('');
      expect(component.selectedTag()).toBeNull();
    });

    it('should open create form', () => {
      component.openCreateForm();
      expect(component.isFormOpen()).toBeTrue();
      expect(component.editingIdea()).toBeNull();
    });

    it('should open edit form', () => {
      const idea = ideasSignal()[0];
      component.openEditForm(idea);
      expect(component.isFormOpen()).toBeTrue();
      expect(component.editingIdea()).toEqual(idea);
    });

    it('should close form', () => {
      component.openCreateForm();
      component.closeForm();
      expect(component.isFormOpen()).toBeFalse();
    });

    it('should save new idea', () => {
      component.openCreateForm();
      component.saveIdea({ title: 'New', content: 'C', tags: [] });
      
      expect(mockAppState.createIdea).toHaveBeenCalled();
      expect(mockStorageService.save).toHaveBeenCalled();
      expect(component.isFormOpen()).toBeFalse();
    });

    it('should update existing idea', () => {
      const idea = ideasSignal()[0];
      component.openEditForm(idea);
      component.saveIdea({ title: 'Updated', content: 'C', tags: [] });
      
      expect(mockAppState.updateIdea).toHaveBeenCalled();
      expect(mockStorageService.save).toHaveBeenCalled();
      expect(component.isFormOpen()).toBeFalse();
    });

    it('should request and confirm delete', () => {
      const idea = ideasSignal()[0];
      component.requestDelete(idea);
      expect(component.ideaToDelete()).toEqual(idea);

      component.confirmDelete();
      expect(mockAppState.deleteIdea).toHaveBeenCalledWith(idea.id);
      expect(mockStorageService.save).toHaveBeenCalled();
      expect(component.ideaToDelete()).toBeNull();
    });

    it('should cancel delete', () => {
      const idea = ideasSignal()[0];
      component.requestDelete(idea);
      component.cancelDelete();
      
      expect(mockAppState.deleteIdea).not.toHaveBeenCalled();
      expect(component.ideaToDelete()).toBeNull();
    });

    it('should open convert form', () => {
      const idea = ideasSignal()[0];
      component.openConvertForm(idea);
      expect(component.ideaToConvert()).toEqual(idea);
      
      const initialPost = component.initialPostForConversion();
      expect(initialPost?.title).toBe(idea.title);
      expect(initialPost?.content).toBe(idea.content);
      expect(initialPost?.tags).toEqual(idea.tags);
      expect(initialPost?.platform).toBeNull();
      expect(initialPost?.status).toBeNull();
    });

    it('should close convert form', () => {
      component.openConvertForm(ideasSignal()[0]);
      component.closeConvertForm();
      expect(component.ideaToConvert()).toBeNull();
    });

    it('should convert idea to post', () => {
      const idea = ideasSignal()[0];
      component.openConvertForm(idea);
      
      const formValue = {
        title: 'New Post',
        content: 'Content',
        platform: 'x',
        status: 'published',
        tags: []
      } as any;
      
      component.convertIdea(formValue);
      
      expect(mockAppState.createPost).toHaveBeenCalled();
      expect(mockAppState.markIdeaAsConverted).toHaveBeenCalled();
      expect(mockStorageService.save).toHaveBeenCalledTimes(2); // One for POSTS, one for IDEAS
      expect(component.ideaToConvert()).toBeNull();
    });
  });
});
