import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostStatus } from '@core/models';
import { AppStateService } from '@core/state/app-state.service';
import { PostActionsService } from '@core/services/post-actions.service';
import { PostFormValue } from '../components/post-form/post-form.component';
import { PostDetailComponent } from './post-detail.component';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let mockPost: Post;
  let mockAppState: { getPostById: jasmine.Spy };
  let mockRouter: { navigate: jasmine.Spy };
  let mockActions: {
    update: jasmine.Spy;
    duplicate: jasmine.Spy;
    delete: jasmine.Spy;
    updateStatus: jasmine.Spy;
    updateScheduledDate: jasmine.Spy;
    setScheduledDate: jasmine.Spy;
  };

  beforeEach(async () => {
    mockPost = {
      id: 'post-1',
      title: 'Angular testing',
      content: 'A useful caption',
      platform: 'instagram',
      status: 'scheduled',
      scheduledDate: '2026-08-20T10:30:00Z',
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
      tags: [{ id: 'tag-1', name: 'angular', color: 'blue' }],
      media: [{ id: 'media-1', url: 'image.jpg', type: 'image', name: 'Image' }]
    };
    mockAppState = {
      getPostById: jasmine.createSpy('getPostById').and.callFake((id: string) => id === mockPost.id ? mockPost : undefined)
    };
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockActions = {
      update: jasmine.createSpy('update'),
      duplicate: jasmine.createSpy('duplicate'),
      delete: jasmine.createSpy('delete'),
      updateStatus: jasmine.createSpy('updateStatus'),
      updateScheduledDate: jasmine.createSpy('updateScheduledDate'),
      setScheduledDate: jasmine.createSpy('setScheduledDate')
    };

    await TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'post-1' } } } },
        { provide: Router, useValue: mockRouter },
        { provide: AppStateService, useValue: mockAppState },
        { provide: PostActionsService, useValue: mockActions }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should resolve and expose a valid post by ID', () => {
    expect(component.post()).toEqual(mockPost);
    expect(mockAppState.getPostById).toHaveBeenCalledWith('post-1');
  });

  it('should render the not-found state for an unknown ID', () => {
    mockAppState.getPostById.and.returnValue(undefined);
    const unknownComponent = TestBed.createComponent(PostDetailComponent);
    unknownComponent.detectChanges();

    expect(unknownComponent.nativeElement.textContent).toContain('Publicación no encontrada');
  });

  it('should delegate status changes and scheduled date changes', () => {
    component.changeStatus('published');
    component.changeDate('2026-08-21T12:00:00Z');

    expect(mockActions.updateStatus).toHaveBeenCalledWith(mockPost.id, 'published');
    expect(mockActions.updateScheduledDate).toHaveBeenCalledWith(mockPost.id, '2026-08-21T12:00:00Z');
  });

  it('should set a date for a post without an existing scheduled date', () => {
    mockPost.scheduledDate = undefined;

    component.changeDate('2026-08-21T12:00:00Z');

    expect(mockActions.setScheduledDate).toHaveBeenCalledWith(mockPost, '2026-08-21T12:00:00Z');
    expect(mockActions.updateScheduledDate).not.toHaveBeenCalled();
  });

  it('should delegate editing and close edit mode after saving', () => {
    const value: PostFormValue = {
      title: 'Updated title',
      content: 'Updated content',
      platform: 'instagram',
      status: 'draft' as PostStatus,
      scheduledDate: undefined,
      tags: [],
      media: []
    };
    component.isEditing.set(true);

    component.saveEdit(value);

    expect(mockActions.update).toHaveBeenCalledWith(mockPost, value);
    expect(component.isEditing()).toBeFalse();
  });

  it('should delegate duplication', () => {
    component.duplicate();

    expect(mockActions.duplicate).toHaveBeenCalledWith(mockPost.id);
  });

  it('should delete the post and navigate back with replaceUrl', () => {
    component.delete();

    expect(mockActions.delete).toHaveBeenCalledWith(mockPost.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts'], { replaceUrl: true });
  });

  it('should provide feedback instead of copying empty content', async () => {
    mockPost.content = '';

    await component.copyContent();

    expect(component.clipboardMessage()).toBe('No hay contenido para copiar.');
  });

  it('should render the main post fields', () => {
    expect(fixture.nativeElement.textContent).toContain(mockPost.title);
    expect(fixture.nativeElement.textContent).toContain(mockPost.content);
    expect(fixture.nativeElement.textContent).toContain('Programada');
    expect(fixture.nativeElement.textContent).toContain('Instagram');
    expect(fixture.nativeElement.textContent).toContain('angular');
    expect(fixture.nativeElement.textContent).toContain('Image');
  });
});
