import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { By } from '@angular/platform-browser';
import { Post } from '../../../../core/models';
import { PLATFORM_META } from '../../../../core/config/platforms.config';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  const mockPost: Post = {
    id: '1',
    title: 'Test Post Title',
    content: 'Test content',
    scheduledDate: '2026-08-18T10:30:00.000Z',
    platform: 'instagram',
    status: 'scheduled',
    tags: [
      { id: '1', name: 'angular', color: 'red' },
      { id: '2', name: 'typescript', color: 'blue' },
      { id: '3', name: 'frontend', color: 'yellow' },
      { id: '4', name: 'web', color: 'green' }
    ],
    media: [{ id: '1', url: 'https://example.com/image.jpg', type: 'image', name: 'test.jpg' }],
    createdAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.componentRef.setInput('variant', 'grid');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.post-card-title')).nativeElement;
    expect(titleEl.textContent.trim()).toBe('Test Post Title');
  });

  it('should render correct platform logo and label', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    
    const platformLabelEl = fixture.debugElement.query(By.css('.platform-info span')).nativeElement;
    const platformIconEl = fixture.debugElement.query(By.css('.platform-info img')).nativeElement;
    
    expect(platformLabelEl.textContent.trim()).toBe(PLATFORM_META['instagram'].label);
    expect(platformIconEl.src).toContain(PLATFORM_META['instagram'].icon);
  });

  it('should render correct status label', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    
    const badgeEl = fixture.debugElement.query(By.css('app-badge')).nativeElement;
    expect(badgeEl.textContent.trim()).toBe('Programada');
  });

  it('should render date and time when scheduledDate is provided', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    
    const dateEl = fixture.debugElement.query(By.css('.datetime .date'));
    const timeEl = fixture.debugElement.query(By.css('.datetime .time'));
    
    expect(dateEl).toBeTruthy();
    expect(timeEl).toBeTruthy();
    // Angular date pipe formatting checking
    expect(dateEl.nativeElement.textContent).toBeTruthy(); 
    expect(timeEl.nativeElement.textContent).toBeTruthy();
  });

  it('should render fallback when scheduledDate is missing', () => {
    const postWithoutDate = { ...mockPost, scheduledDate: undefined };
    fixture.componentRef.setInput('post', postWithoutDate);
    fixture.detectChanges();
    
    const emptyDateEl = fixture.debugElement.query(By.css('.date.empty'));
    expect(emptyDateEl).toBeTruthy();
    expect(emptyDateEl.nativeElement.textContent.trim()).toBe('Sin fecha programada');
  });

  it('should render media when available', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    
    const imgEl = fixture.debugElement.query(By.css('.post-card-media > img'));
    expect(imgEl).toBeTruthy();
    expect(imgEl.nativeElement.src).toBe('https://example.com/image.jpg');
  });

  it('should not render media container when media is empty', () => {
    const postWithoutMedia = { ...mockPost, media: [] };
    fixture.componentRef.setInput('post', postWithoutMedia);
    fixture.detectChanges();
    
    const mediaEl = fixture.debugElement.query(By.css('.post-card-media'));
    expect(mediaEl).toBeNull();
  });

  it('should emit delete event when delete button is clicked', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    spyOn(component.delete, 'emit');
    
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn')).nativeElement;
    deleteBtn.click();
    
    expect(component.delete.emit).toHaveBeenCalledWith(mockPost);
  });

  it('should max 3 tags and +N for the rest', () => {
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
    
    const tagEls = fixture.debugElement.queryAll(By.css('.post-card-tags .tag'));
    expect(tagEls.length).toBe(4); // 3 visible + 1 extra indicator
    expect(tagEls[0].nativeElement.textContent.trim()).toBe('#angular');
    expect(tagEls[1].nativeElement.textContent.trim()).toBe('#typescript');
    expect(tagEls[2].nativeElement.textContent.trim()).toBe('#frontend');
    expect(tagEls[3].nativeElement.textContent.trim()).toBe('+1');
  });

  it('should apply variant class correctly', () => {
    fixture.componentRef.setInput('post', mockPost);
    
    fixture.componentRef.setInput('variant', 'grid');
    fixture.detectChanges();
    let cardEl = fixture.debugElement.query(By.css('.post-card')).nativeElement;
    expect(cardEl.classList).toContain('variant-grid');
    
    fixture.componentRef.setInput('variant', 'list');
    fixture.detectChanges();
    cardEl = fixture.debugElement.query(By.css('.post-card')).nativeElement;
    expect(cardEl.classList).toContain('variant-list');
  });
});
