import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { UpcomingPostCardComponent } from './upcoming-post-card.component';
import { Post } from '../../../../core/models';

describe('UpcomingPostCardComponent', () => {
  let component: UpcomingPostCardComponent;
  let fixture: ComponentFixture<UpcomingPostCardComponent>;

  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    platform: 'instagram',
    status: 'scheduled',
    scheduledDate: '2026-08-17T10:00:00Z',
    createdAt: '',
    updatedAt: '',
    content: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingPostCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingPostCardComponent);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render post title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h4')?.textContent).toContain('Test Post');
  });

  it('should show correct status label and color', () => {
    expect(component.statusLabel()).toBe('Programada');
    expect(component.statusColor()).toBe('primary');
  });

  it('should show platform metadata', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const metaText = compiled.querySelector('.upcoming-meta')?.textContent;
    expect(metaText).toContain('Instagram'); // From PLATFORM_META
  });

  it('should show placeholder when no media exists', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.media-placeholder')).toBeTruthy();
    expect(compiled.querySelector('img.media-preview')).toBeFalsy();
  });

  it('should show media preview when media exists', () => {
    fixture.componentRef.setInput('post', {
      ...mockPost,
      media: [{ id: 'm1', type: 'image', url: 'https://example.com/img.jpg', name: 'img.jpg', size: 100 }]
    });
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.media-placeholder')).toBeFalsy();
    const img = compiled.querySelector('img.media-preview') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe('https://example.com/img.jpg');
  });

  it('should format date and time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const metaText = compiled.querySelector('.upcoming-meta')?.textContent;
    // Depending on timezone, exact date text varies, but it should contain something
    expect(metaText).toContain('17');
    expect(metaText).toContain(':');
  });
});
