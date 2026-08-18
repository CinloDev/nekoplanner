import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PostsComponent } from './posts.component';
import { AppStateService } from '../../core/state/app-state.service';
import { StorageService } from '../../core/storage/storage.service';
import { Post, Platform, PostStatus } from '../../core/models';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let mockAppState: any;
  let mockPostsSignal: any;

  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Angular Guide',
      content: 'Learn Angular basics',
      platform: 'instagram',
      status: 'published',
      scheduledDate: '2023-10-01T10:00:00Z',
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'React vs Angular',
      content: 'Comparison between frameworks',
      platform: 'youtube',
      status: 'draft',
      scheduledDate: '2023-11-01T10:00:00Z',
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z'
    },
    {
      id: '3',
      title: 'No date post',
      content: 'Just an idea',
      platform: 'x',
      status: 'idea',
      // No scheduledDate
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z'
    }
  ];

  let mockStorageService: any;

  beforeEach(async () => {
    mockPostsSignal = signal(mockPosts);
    mockAppState = {
      posts: mockPostsSignal,
      createPost: jasmine.createSpy('createPost')
    };

    mockStorageService = {
      save: jasmine.createSpy('save')
    };

    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [
        { provide: AppStateService, useValue: mockAppState },
        { provide: StorageService, useValue: mockStorageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have default state values', () => {
      expect(component.searchQuery()).toBe('');
      expect(component.selectedPlatform()).toBeNull();
      expect(component.selectedStatus()).toBeNull();
      expect(component.sortBy()).toBe('date');
      expect(component.sortDirection()).toBe('desc');
      expect(component.viewMode()).toBe('grid');
    });

    it('should show all posts initially', () => {
      expect(component.visiblePosts().length).toBe(3);
    });
  });

  describe('Search', () => {
    it('should filter by title case-insensitive', () => {
      component.searchQuery.set('angular');
      expect(component.visiblePosts().length).toBe(2);
      expect(component.visiblePosts()[0].id).toBe('2'); // Nov comes before Oct
    });

    it('should filter by content case-insensitive', () => {
      component.searchQuery.set('frameworks');
      expect(component.visiblePosts().length).toBe(1);
      expect(component.visiblePosts()[0].id).toBe('2');
    });

    it('should show all if search is empty', () => {
      component.searchQuery.set('   ');
      expect(component.visiblePosts().length).toBe(3);
    });
  });

  describe('Platform Filter', () => {
    it('should filter by specific platform', () => {
      component.selectedPlatform.set('youtube');
      expect(component.visiblePosts().length).toBe(1);
      expect(component.visiblePosts()[0].id).toBe('2');
    });

    it('should show all when platform is null', () => {
      component.selectedPlatform.set('youtube');
      component.selectedPlatform.set(null);
      expect(component.visiblePosts().length).toBe(3);
    });
  });

  describe('Status Filter', () => {
    it('should filter by specific status', () => {
      component.selectedStatus.set('published');
      expect(component.visiblePosts().length).toBe(1);
      expect(component.visiblePosts()[0].id).toBe('1');
    });

    it('should show all when status is null', () => {
      component.selectedStatus.set('published');
      component.selectedStatus.set(null);
      expect(component.visiblePosts().length).toBe(3);
    });
  });

  describe('Sorting', () => {
    it('should sort by date desc by default (no date at the end)', () => {
      expect(component.visiblePosts()[0].id).toBe('2'); // Nov
      expect(component.visiblePosts()[1].id).toBe('1'); // Oct
      expect(component.visiblePosts()[2].id).toBe('3'); // No date
    });

    it('should sort by date asc (no date at the end)', () => {
      component.sortDirection.set('asc');
      expect(component.visiblePosts()[0].id).toBe('1'); // Oct
      expect(component.visiblePosts()[1].id).toBe('2'); // Nov
      expect(component.visiblePosts()[2].id).toBe('3'); // No date
    });

    it('should sort by title asc', () => {
      component.sortBy.set('title');
      component.sortDirection.set('asc');
      expect(component.visiblePosts()[0].id).toBe('1'); // Angular...
      expect(component.visiblePosts()[1].id).toBe('3'); // No date...
      expect(component.visiblePosts()[2].id).toBe('2'); // React...
    });

    it('should sort by title desc', () => {
      component.sortBy.set('title');
      component.sortDirection.set('desc');
      expect(component.visiblePosts()[0].id).toBe('2');
      expect(component.visiblePosts()[1].id).toBe('3');
      expect(component.visiblePosts()[2].id).toBe('1');
    });

    it('should sort by status asc (priority)', () => {
      component.sortBy.set('status');
      component.sortDirection.set('asc');
      // idea (3) -> draft (2) -> published (1)
      expect(component.visiblePosts()[0].id).toBe('3');
      expect(component.visiblePosts()[1].id).toBe('2');
      expect(component.visiblePosts()[2].id).toBe('1');
    });

    it('should sort by status desc (priority)', () => {
      component.sortBy.set('status');
      component.sortDirection.set('desc');
      // published (1) -> draft (2) -> idea (3)
      expect(component.visiblePosts()[0].id).toBe('1');
      expect(component.visiblePosts()[1].id).toBe('2');
      expect(component.visiblePosts()[2].id).toBe('3');
    });
  });

  describe('Combinations', () => {
    it('should combine search, platform, and status', () => {
      component.searchQuery.set('angular'); 
      component.selectedPlatform.set('instagram');
      component.selectedStatus.set('published');
      expect(component.visiblePosts().length).toBe(1);
      expect(component.visiblePosts()[0].id).toBe('1');
      
      component.selectedStatus.set('draft');
      expect(component.visiblePosts().length).toBe(0);
    });
  });

  describe('View Mode', () => {
    it('should toggle view mode', () => {
      expect(component.viewMode()).toBe('grid');
      component.toggleViewMode('list');
      expect(component.viewMode()).toBe('list');
    });
  });

  describe('Reset', () => {
    it('should clear all filters except viewMode', () => {
      component.searchQuery.set('angular');
      component.selectedPlatform.set('instagram');
      component.selectedStatus.set('published');
      component.sortBy.set('title');
      component.sortDirection.set('asc');
      component.viewMode.set('list');

      component.clearFilters();

      expect(component.searchQuery()).toBe('');
      expect(component.selectedPlatform()).toBeNull();
      expect(component.selectedStatus()).toBeNull();
      expect(component.sortBy()).toBe('date');
      expect(component.sortDirection()).toBe('desc');
      expect(component.viewMode()).toBe('list'); // Preserved
    });
  });

  describe('Empty States', () => {
    it('should identify when there are no posts globally', () => {
      expect(component.hasPosts()).toBeTrue();
      mockPostsSignal.set([]);
      expect(component.hasPosts()).toBeFalse();
    });
  });

  describe('Drawer and Create Post', () => {
    it('should open and close drawer', () => {
      expect(component.isDrawerOpen()).toBeFalse();
      component.openDrawer();
      expect(component.isDrawerOpen()).toBeTrue();
      component.closeDrawer();
      expect(component.isDrawerOpen()).toBeFalse();
    });

    it('should save post and call appState and storageService', () => {
      component.openDrawer();
      
      const formValue = {
        title: 'New Post',
        content: 'Content',
        platform: 'instagram' as Platform,
        status: 'draft' as PostStatus,
        scheduledDate: undefined,
        tags: [],
        media: []
      };

      component.onSavePost(formValue);

      expect(mockAppState.createPost).toHaveBeenCalled();
      const createdPost = mockAppState.createPost.calls.mostRecent().args[0];
      expect(createdPost.title).toBe('New Post');
      expect(createdPost.id).toBeTruthy();
      expect(createdPost.createdAt).toBeTruthy();

      expect(mockStorageService.save).toHaveBeenCalled();
      expect(component.isDrawerOpen()).toBeFalse();
    });
  });

  describe('Delete Flow', () => {
    beforeEach(() => {
      mockAppState.deletePost = jasmine.createSpy('deletePost');
    });

    it('should set postToDelete when confirmDelete is called', () => {
      expect(component.postToDelete()).toBeNull();
      component.confirmDelete(mockPosts[0]);
      expect(component.postToDelete()).toEqual(mockPosts[0]);
    });

    it('should clear postToDelete when cancelDelete is called', () => {
      component.confirmDelete(mockPosts[0]);
      component.cancelDelete();
      expect(component.postToDelete()).toBeNull();
    });

    it('should call deletePost, save to storage and clear postToDelete on executeDelete', () => {
      component.confirmDelete(mockPosts[0]);
      component.executeDelete();
      
      expect(mockAppState.deletePost).toHaveBeenCalledWith(mockPosts[0].id);
      expect(mockStorageService.save).toHaveBeenCalled();
      expect(component.postToDelete()).toBeNull();
    });

    it('should do nothing on executeDelete if postToDelete is null', () => {
      component.executeDelete();
      expect(mockAppState.deletePost).not.toHaveBeenCalled();
      expect(mockStorageService.save).not.toHaveBeenCalled();
    });
  });

  describe('Duplicate Flow', () => {
    beforeEach(() => {
      mockAppState.duplicatePost = jasmine.createSpy('duplicatePost');
    });

    it('should call duplicatePost on appState and save to storage', () => {
      component.duplicatePost(mockPosts[0]);
      
      expect(mockAppState.duplicatePost).toHaveBeenCalledWith(mockPosts[0].id);
      expect(mockStorageService.save).toHaveBeenCalled();
    });
  });
});
