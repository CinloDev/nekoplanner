import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppStateService } from '@core/state/app-state.service';
import { StorageService } from '@core/storage/storage.service';
import { StorageKeys } from '@core/storage/storage-keys';
import { PostActionsService } from './post-actions.service';

describe('PostActionsService', () => {
  it('persists mutations after delegating them to AppStateService', () => {
    const posts = signal<any[]>([]);
    const appState = {
      posts,
      createPost: jasmine.createSpy('createPost').and.callFake((post: unknown) => posts.update(items => [...items, post])),
      deletePost: jasmine.createSpy('deletePost'),
      updatePost: jasmine.createSpy('updatePost'),
      duplicatePost: jasmine.createSpy('duplicatePost'),
      updatePostScheduledDate: jasmine.createSpy('updatePostScheduledDate')
    };
    const storage = { save: jasmine.createSpy('save') };

    TestBed.configureTestingModule({
      providers: [
        PostActionsService,
        { provide: AppStateService, useValue: appState },
        { provide: StorageService, useValue: storage }
      ]
    });

    const service = TestBed.inject(PostActionsService);
    service.create({ title: 'Post', content: 'Caption', platform: 'x', status: 'draft' });

    expect(appState.createPost).toHaveBeenCalled();
    expect(storage.save).toHaveBeenCalledWith(StorageKeys.POSTS, posts());
  });
});
