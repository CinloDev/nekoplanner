import { Injectable, inject } from '@angular/core';
import { Post } from '@core/models';
import { StorageKeys } from '@core/storage/storage-keys';
import { StorageService } from '@core/storage/storage.service';
import { AppStateService } from '@core/state/app-state.service';
import { PostFormData, createNewPost, updatePostFromForm } from '@core/utils/post.utils';

@Injectable({ providedIn: 'root' })
export class PostActionsService {
  private readonly appState = inject(AppStateService);
  private readonly storage = inject(StorageService);

  create(formValue: PostFormData): Post {
    const post = createNewPost(formValue);
    this.appState.createPost(post);
    this.persist();
    return post;
  }

  update(post: Post, formValue: PostFormData): Post {
    const updatedPost = updatePostFromForm(post, formValue);
    this.appState.updatePost(updatedPost);
    this.persist();
    return updatedPost;
  }

  delete(postId: string): void {
    this.appState.deletePost(postId);
    this.persist();
  }

  duplicate(postId: string): void {
    this.appState.duplicatePost(postId);
    this.persist();
  }

  updateScheduledDate(postId: string, date: string): void {
    this.appState.updatePostScheduledDate(postId, date);
    this.persist();
  }

  setScheduledDate(post: Post, date: string): void {
    this.appState.updatePost({ ...post, scheduledDate: date, updatedAt: new Date().toISOString() });
    this.persist();
  }

  updateStatus(post: Post, status: Post['status']): void {
    this.appState.updatePost({ ...post, status, updatedAt: new Date().toISOString() });
    this.persist();
  }

  private persist(): void {
    this.storage.save(StorageKeys.POSTS, this.appState.posts());
  }
}
