import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { AppStateService } from '../../core/state/app-state.service';
import { StorageService } from '../../core/storage/storage.service';
import { Post } from '../../core/models';
import { signal } from '@angular/core';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockAppState: jasmine.SpyObj<AppStateService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    // Mocks manuales
    const mockPosts = signal<Post[]>([
      {
        id: '1',
        title: 'Post 1',
        content: '',
        platform: 'x',
        status: 'published',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        scheduledDate: '2026-08-15T10:30:00Z', // Agosto
        tags: []
      },
      {
        id: '2',
        title: 'Post sin scheduled',
        content: '',
        platform: 'x',
        status: 'draft',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        tags: []
      },
      {
        id: '3',
        title: 'Post 3 (Tarde)',
        content: '',
        platform: 'x',
        status: 'scheduled',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        scheduledDate: '2026-08-15T18:00:00Z', // Mismo dia, despues
        tags: []
      }
    ]);

    mockAppState = jasmine.createSpyObj('AppStateService', ['updatePostScheduledDate'], {
      posts: mockPosts
    });
    
    mockStorageService = jasmine.createSpyObj('StorageService', ['save']);

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: AppStateService, useValue: mockAppState },
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    
    // Forzamos un mes conocido para no depender del "Hoy" real del sistema
    component.currentMonth.set(new Date('2026-08-01T12:00:00Z'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute visible posts and ignore posts without scheduledDate', () => {
    const posts = component.calendarPosts();
    expect(posts.length).toBe(2);
    expect(posts.find(p => p.id === '2')).toBeUndefined();
  });

  it('should sort posts by scheduledDate correctly within calendarPosts', () => {
    const posts = component.calendarPosts();
    expect(posts[0].id).toBe('1'); // 10:30
    expect(posts[1].id).toBe('3'); // 18:00
  });

  it('should group posts correctly by day', () => {
    // 2026-08-15
    const postsByDay = component.postsByDay();
    // La clave generada usara el format de la timezone local, asumiendo que 12:00Z no se cambia de dia
    let keyFound = false;
    for (const [key, posts] of postsByDay.entries()) {
      if (key.includes('2026-08-15')) {
        keyFound = true;
        expect(posts.length).toBe(2);
      }
    }
    expect(keyFound).withContext('Should have grouped posts in 2026-08-15').toBeTrue();
  });

  it('should navigate to next and previous months', () => {
    const initialMonth = component.currentMonth().getMonth(); // 7 (Agosto)
    
    component.goToNextMonth();
    expect(component.currentMonth().getMonth()).toBe(8); // Septiembre
    
    component.goToPreviousMonth();
    expect(component.currentMonth().getMonth()).toBe(7); // Agosto
  });

  describe('Filters', () => {
    it('should have initial state with no filters', () => {
      expect(component.selectedPlatform()).toBeNull();
      expect(component.selectedStatus()).toBeNull();
      expect(component.searchQuery()).toBe('');
      expect(component.filteredPosts().length).toBe(2);
    });

    it('should filter by platform', () => {
      component.selectedPlatform.set('x');
      expect(component.filteredPosts().length).toBe(2);
      
      component.selectedPlatform.set('instagram');
      expect(component.filteredPosts().length).toBe(0);
    });

    it('should filter by status', () => {
      component.selectedStatus.set('published');
      expect(component.filteredPosts().length).toBe(1);
      expect(component.filteredPosts()[0].id).toBe('1');
    });

    it('should filter by search query (case-insensitive title/content)', () => {
      component.searchQuery.set(' TARDE ');
      expect(component.filteredPosts().length).toBe(1);
      expect(component.filteredPosts()[0].id).toBe('3');

      component.searchQuery.set('NoExisto');
      expect(component.filteredPosts().length).toBe(0);
      
      component.searchQuery.set('');
      expect(component.filteredPosts().length).toBe(2);
    });

    it('should combine multiple filters', () => {
      component.selectedPlatform.set('x');
      component.selectedStatus.set('published');
      expect(component.filteredPosts().length).toBe(1);

      component.searchQuery.set('Tarde'); // No coincide con el post 'published'
      expect(component.filteredPosts().length).toBe(0);
    });

    it('should clear all filters', () => {
      component.selectedPlatform.set('instagram');
      component.selectedStatus.set('scheduled');
      component.searchQuery.set('Test');
      
      component.clearFilters();
      
      expect(component.selectedPlatform()).toBeNull();
      expect(component.selectedStatus()).toBeNull();
      expect(component.searchQuery()).toBe('');
      expect(component.filteredPosts().length).toBe(2);
    });
  });
  describe('Drag & Drop', () => {
    it('should update post scheduledDate and persist state on drop', () => {
      const mockPost: Post = {
        id: '1', title: 'Post 1', content: '', platform: 'x', 
        status: 'published', createdAt: '2026-08-10T10:00:00Z', updatedAt: '2026-08-10T10:00:00Z',
        scheduledDate: '2026-08-15T10:30:00Z', tags: []
      };
      const targetDate = new Date('2026-08-20T00:00:00Z');
      
      component.onPostDropped({ post: mockPost, targetDate });
      
      expect(mockAppState.updatePostScheduledDate).toHaveBeenCalledWith('1', targetDate.toISOString());
      expect(mockStorageService.save).toHaveBeenCalled();
    });
  });
});
