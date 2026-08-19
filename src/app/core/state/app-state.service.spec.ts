import { TestBed } from '@angular/core/testing';
import { AppStateService } from './app-state.service';
import { Post, Idea, Platform, PostStatus } from '../models';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStateService]
    });
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postCounts', () => {
    it('should return 0 for all counts when there are no posts', () => {
      const counts = service.postCounts();
      expect(counts.total).toBe(0);
      expect(counts.scheduled).toBe(0);
      expect(counts.published).toBe(0);
    });

    it('should count correctly with a single post', () => {
      service.setPosts([{ id: '1', title: 'Test', platform: 'x', status: 'published', createdAt: '', updatedAt: '', content: '' } as Post]);
      const counts = service.postCounts();
      expect(counts.total).toBe(1);
      expect(counts.published).toBe(1);
      expect(counts.scheduled).toBe(0);
    });

    it('should count multiple posts correctly', () => {
      service.setPosts([
        { id: '1', status: 'published' } as Post,
        { id: '2', status: 'scheduled' } as Post,
        { id: '3', status: 'scheduled' } as Post,
        { id: '4', status: 'draft' } as Post,
      ]);
      const counts = service.postCounts();
      expect(counts.total).toBe(4);
      expect(counts.published).toBe(1);
      expect(counts.scheduled).toBe(2);
      expect(counts.draft).toBe(1);
    });
  });

  describe('ideasCount', () => {
    it('should return 0 when there are no ideas', () => {
      expect(service.ideasCount()).toBe(0);
    });

    it('should count ideas correctly', () => {
      service.setIdeas([{ id: 'i1', title: 'Idea 1' } as Idea]);
      expect(service.ideasCount()).toBe(1);

      service.setIdeas([{ id: 'i1' } as Idea, { id: 'i2' } as Idea, { id: 'i3' } as Idea]);
      expect(service.ideasCount()).toBe(3);
    });
  });

  describe('createIdea', () => {
    it('should add a new idea to the beginning of the list', () => {
      service.setIdeas([{ id: '1', title: 'Existing Idea' } as Idea]);
      const newIdea: Idea = { id: '2', title: 'New Idea', content: '', createdAt: '', updatedAt: '' };
      
      service.createIdea(newIdea);
      
      const ideas = service.ideas();
      expect(ideas.length).toBe(2);
      expect(ideas[0]).toEqual(newIdea);
      expect(ideas[1].id).toBe('1');
    });
  });

  describe('updateIdea', () => {
    it('should update an existing idea', () => {
      const initialIdea: Idea = { id: '1', title: 'Idea 1', content: 'Old content', createdAt: '', updatedAt: '' };
      service.setIdeas([initialIdea, { id: '2', title: 'Idea 2' } as Idea]);
      
      const updatedIdea: Idea = { ...initialIdea, content: 'New content', updatedAt: '2026-08-18' };
      service.updateIdea(updatedIdea);
      
      const ideas = service.ideas();
      expect(ideas.length).toBe(2);
      expect(ideas[0]).toEqual(updatedIdea);
      expect(ideas[1].id).toBe('2');
    });

    it('should do nothing if idea ID does not exist', () => {
      const initialIdeas = [{ id: '1', title: 'Idea 1' } as Idea];
      service.setIdeas(initialIdeas);
      
      service.updateIdea({ id: '999', title: 'Nonexistent' } as Idea);
      
      expect(service.ideas()).toEqual(initialIdeas);
    });
  });

  describe('deleteIdea', () => {
    it('should remove existing idea and leave others intact', () => {
      service.setIdeas([
        { id: '1', title: 'Idea 1' } as Idea,
        { id: '2', title: 'Idea 2' } as Idea,
        { id: '3', title: 'Idea 3' } as Idea
      ]);
      service.deleteIdea('2');
      expect(service.ideas().length).toBe(2);
      expect(service.ideas().map(i => i.id)).toEqual(['1', '3']);
    });

    it('should do nothing if idea ID does not exist', () => {
      const initialIdeas = [
        { id: '1', title: 'Idea 1' } as Idea,
        { id: '2', title: 'Idea 2' } as Idea
      ];
      service.setIdeas(initialIdeas);
      service.deleteIdea('3');
      expect(service.ideas().length).toBe(2);
      expect(service.ideas()).toEqual(initialIdeas);
    });
  });

  describe('deletePost', () => {
    it('should remove existing post and leave others intact', () => {
      service.setPosts([
        { id: '1', title: 'Post 1' } as Post,
        { id: '2', title: 'Post 2' } as Post,
        { id: '3', title: 'Post 3' } as Post
      ]);
      service.deletePost('2');
      expect(service.posts().length).toBe(2);
      expect(service.posts().map(p => p.id)).toEqual(['1', '3']);
    });

    it('should do nothing if post ID does not exist', () => {
      const initialPosts = [
        { id: '1', title: 'Post 1' } as Post,
        { id: '2', title: 'Post 2' } as Post
      ];
      service.setPosts(initialPosts);
      service.deletePost('3');
      expect(service.posts().length).toBe(2);
      expect(service.posts()).toEqual(initialPosts);
    });

    it('should handle deleting the only post', () => {
      service.setPosts([{ id: '1', title: 'Post 1' } as Post]);
      service.deletePost('1');
      expect(service.posts().length).toBe(0);
    });
  });

  describe('duplicatePost', () => {
    it('should create a duplicate with new ID, timestamps, draft status, and clear scheduledDate', () => {
      const original: Post = {
        id: '1',
        title: 'Original Post',
        content: 'Content',
        platform: 'x',
        status: 'published',
        scheduledDate: '2026-08-20T10:00:00Z',
        createdAt: '2026-08-01T10:00:00Z',
        updatedAt: '2026-08-01T10:00:00Z',
        tags: [{ id: 't1', name: 'tag', color: 'blue' }],
        media: [{ id: 'm1', url: 'img.jpg', type: 'image', name: 'img' }]
      };
      
      service.setPosts([original]);
      service.duplicatePost('1');

      const posts = service.posts();
      expect(posts.length).toBe(2);
      
      // Duplicated post is inserted at the beginning
      const duplicate = posts[0];
      const originalPostAfter = posts[1];

      // Original unchanged
      expect(originalPostAfter).toEqual(original);

      // Duplicate validations
      expect(duplicate.id).not.toBe(original.id);
      expect(duplicate.id).toBeTruthy();
      expect(duplicate.title).toBe('Original Post (copia)');
      expect(duplicate.status).toBe('draft');
      expect(duplicate.scheduledDate).toBeUndefined();
      
      // Check new timestamps
      expect(duplicate.createdAt).not.toBe(original.createdAt);
      expect(duplicate.updatedAt).not.toBe(original.updatedAt);
      
      // Arrays should be independent copies
      expect(duplicate.tags).toEqual(original.tags);
      expect(duplicate.tags).not.toBe(original.tags);
      
      expect(duplicate.media).toEqual(original.media);
      expect(duplicate.media).not.toBe(original.media);
      
      // Keep other content
      expect(duplicate.content).toBe(original.content);
      expect(duplicate.platform).toBe(original.platform);
    });

    it('should do nothing if post ID does not exist', () => {
      const initialPosts = [{ id: '1', title: 'Post 1' } as Post];
      service.setPosts(initialPosts);
      service.duplicatePost('999');
      expect(service.posts().length).toBe(1);
    });

    it('should duplicate multiple times independently', () => {
      service.setPosts([{ id: '1', title: 'Post', status: 'published' } as Post]);
      service.duplicatePost('1');
      service.duplicatePost('1');
      
      const posts = service.posts();
      expect(posts.length).toBe(3);
      expect(posts[0].id).not.toBe(posts[1].id);
      expect(posts[0].title).toBe('Post (copia)');
      expect(posts[1].title).toBe('Post (copia)');
    });
  });

  describe('updatePostScheduledDate', () => {
    it('should update scheduledDate preserving original local time', () => {
      // Configuramos una fecha base: 2026-08-15 14:30:00 (local time)
      // Como dependemos de timezone local para `new Date(string)`,
      // creamos un date objeto inicial para saber exactamente que hora local debe tener.
      const baseDate = new Date(2026, 7, 15, 14, 30, 45, 123);
      const post: Post = { 
        id: '1', title: 'Test', content: '', platform: 'x', 
        status: 'scheduled', createdAt: '2026-08-10', updatedAt: '2026-08-10',
        scheduledDate: baseDate.toISOString(), tags: [] 
      };
      
      service.setPosts([post]);
      
      // Destino: un nuevo día
      const targetDate = new Date(2026, 7, 21, 0, 0, 0); // 21 de agosto
      
      service.updatePostScheduledDate('1', targetDate.toISOString());
      
      const updatedPost = service.posts()[0];
      const updatedDateObj = new Date(updatedPost.scheduledDate!);
      
      expect(updatedDateObj.getFullYear()).toBe(2026);
      expect(updatedDateObj.getMonth()).toBe(7); // Agosto
      expect(updatedDateObj.getDate()).toBe(21);
      
      // La hora local debe permanecer igual
      expect(updatedDateObj.getHours()).toBe(14);
      expect(updatedDateObj.getMinutes()).toBe(30);
      expect(updatedDateObj.getSeconds()).toBe(45);
      expect(updatedDateObj.getMilliseconds()).toBe(123);
    });

    it('should ignore if post is not found', () => {
      const post: Post = { 
        id: '1', title: 'Test', content: '', platform: 'x', 
        status: 'scheduled', createdAt: '2026-08-10', updatedAt: '2026-08-10',
        scheduledDate: new Date().toISOString(), tags: [] 
      };
      service.setPosts([post]);
      
      service.updatePostScheduledDate('nonexistent', new Date().toISOString());
      
      expect(service.posts()[0]).toEqual(post); // Unchanged
    });

    it('should ignore if post does not have a scheduledDate initially', () => {
      const post: Post = { 
        id: '1', title: 'Test', content: '', platform: 'x', 
        status: 'draft', createdAt: '2026-08-10', updatedAt: '2026-08-10',
        tags: [] 
      };
      service.setPosts([post]);
      
      service.updatePostScheduledDate('1', new Date().toISOString());
      
      expect(service.posts()[0]).toEqual(post); // Unchanged
    });
  });

  describe('postsThisMonth', () => {
    beforeEach(() => {
      service.setCurrentDate('2026-08-17T12:00:00Z');
    });

    it('should return 0 if there are no posts', () => {
      expect(service.postsThisMonth()).toBe(0);
    });

    it('should count posts within the current month regardless of status', () => {
      service.setPosts([
        { id: '1', status: 'scheduled', scheduledDate: '2026-08-01T10:00:00Z' } as Post,
        { id: '2', status: 'published', scheduledDate: '2026-08-15T10:00:00Z' } as Post,
      ]);
      expect(service.postsThisMonth()).toBe(2);
    });

    it('should not count posts outside the current month', () => {
      service.setPosts([
        { id: '1', status: 'scheduled', scheduledDate: '2026-07-31T10:00:00Z' } as Post, // post del mes anterior
        { id: '2', status: 'scheduled', scheduledDate: '2026-09-01T20:00:00Z' } as Post, // post del mes siguiente
        { id: '3', status: 'archived', scheduledDate: '2025-08-15T20:00:00Z' } as Post, // archived fuera del mes
      ]);
      expect(service.postsThisMonth()).toBe(0);
    });

    it('should not count posts without scheduledDate', () => {
      service.setPosts([
        { id: '1', status: 'scheduled' } as Post, // missing scheduledDate
      ]);
      expect(service.postsThisMonth()).toBe(0);
    });

    it('should react to currentDate changes', () => {
      service.setPosts([
        { id: '1', status: 'scheduled', scheduledDate: '2026-09-10T10:00:00Z' } as Post,
      ]);
      expect(service.postsThisMonth()).toBe(0);
      
      service.setCurrentDate('2026-09-01T12:00:00Z');
      expect(service.postsThisMonth()).toBe(1);
    });
  });

  describe('platformDistribution', () => {
    it('should return empty distribution with 0 percentage when no posts', () => {
      const dist = service.platformDistribution();
      expect(dist.length).toBe(0);
    });

    it('should return distribution for a single platform', () => {
      service.setPosts([
        { id: '1', platform: 'x' } as Post,
      ]);
      const dist = service.platformDistribution();
      expect(dist.length).toBe(1);
      expect(dist[0].platform).toBe('x');
      expect(dist[0].count).toBe(1);
      expect(dist[0].percentage).toBe(100);
    });

    it('should calculate percentages correctly for multiple platforms', () => {
      service.setPosts([
        { id: '1', platform: 'x' } as Post,
        { id: '2', platform: 'x' } as Post,
        { id: '3', platform: 'instagram' } as Post,
        { id: '4', platform: 'linkedin' } as Post,
      ]);
      const dist = service.platformDistribution();
      expect(dist.length).toBe(3);
      
      const xDist = dist.find(d => d.platform === 'x');
      expect(xDist?.count).toBe(2);
      expect(xDist?.percentage).toBe(50); // 2 out of 4

      const igDist = dist.find(d => d.platform === 'instagram');
      expect(igDist?.count).toBe(1);
      expect(igDist?.percentage).toBe(25); // 1 out of 4
    });
  });

  describe('statusDistribution', () => {
    it('should initialize with 0 for all statuses when there are no posts', () => {
      const dist = service.statusDistribution();
      expect(dist.length).toBe(5); // idea, draft, scheduled, published, archived
      dist.forEach(d => {
        expect(d.count).toBe(0);
        expect(d.percentage).toBe(0);
      });
    });

    it('should calculate counts and percentages correctly for multiple statuses', () => {
      service.setPosts([
        { id: '1', status: 'published' } as Post,
        { id: '2', status: 'published' } as Post,
        { id: '3', status: 'scheduled' } as Post,
        { id: '4', status: 'draft' } as Post,
      ]);
      const dist = service.statusDistribution();
      
      const pubDist = dist.find(d => d.status === 'published');
      expect(pubDist?.count).toBe(2);
      expect(pubDist?.percentage).toBe(50); // 2 out of 4

      const schDist = dist.find(d => d.status === 'scheduled');
      expect(schDist?.count).toBe(1);
      expect(schDist?.percentage).toBe(25); // 1 out of 4

      const ideaDist = dist.find(d => d.status === 'idea');
      expect(ideaDist?.count).toBe(0);
      expect(ideaDist?.percentage).toBe(0);
    });
  });
});
