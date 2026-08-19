import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeaCardComponent } from './idea-card.component';
import { ComponentRef } from '@angular/core';
import { Idea } from '@core/models';

describe('IdeaCardComponent', () => {
  let component: IdeaCardComponent;
  let fixture: ComponentFixture<IdeaCardComponent>;
  let componentRef: ComponentRef<IdeaCardComponent>;

  const mockIdea: Idea = {
    id: '1',
    title: 'Test Idea',
    content: 'This is a test idea content',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z',
    tags: [
      { id: 't1', name: 'angular', color: '#dd0031' },
      { id: 't2', name: 'typescript', color: '#3178c6' },
      { id: 't3', name: 'frontend', color: '#14b8a6' },
      { id: 't4', name: 'extra', color: '#cccccc' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeaCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    componentRef.setInput('idea', mockIdea);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render idea title and content', () => {
    const titleEl = fixture.nativeElement.querySelector('.idea-title');
    const contentEl = fixture.nativeElement.querySelector('.idea-text');
    
    expect(titleEl.textContent.trim()).toBe(mockIdea.title);
    expect(contentEl.textContent.trim()).toBe(mockIdea.content);
  });

  it('should display tags correctly with extra count', () => {
    const tags = fixture.nativeElement.querySelectorAll('.tag');
    expect(tags.length).toBe(4); // 3 visible + 1 extra indicator
    
    expect(tags[0].textContent.trim()).toBe('#angular');
    expect(tags[1].textContent.trim()).toBe('#typescript');
    expect(tags[2].textContent.trim()).toBe('#frontend');
    expect(tags[3].textContent.trim()).toBe('+1'); // Extra tag
  });

  it('should render the updated date', () => {
    const dateEl = fixture.nativeElement.querySelector('.updated');
    // We mock '2026-08-12' -> pipe output depends on locale but it should contain 12
    expect(dateEl.textContent).toContain('12');
  });

  it('should emit edit event', () => {
    spyOn(component.edit, 'emit');
    const editBtn = fixture.nativeElement.querySelector('.edit-btn');
    editBtn.click();
    expect(component.edit.emit).toHaveBeenCalledWith(mockIdea);
  });

  it('should emit delete event', () => {
    spyOn(component.delete, 'emit');
    const deleteBtn = fixture.nativeElement.querySelector('.delete-btn');
    deleteBtn.click();
    expect(component.delete.emit).toHaveBeenCalledWith(mockIdea);
  });

  it('should emit convert event', () => {
    spyOn(component.convert, 'emit');
    const convertBtn = fixture.nativeElement.querySelector('.convert-btn');
    convertBtn.click();
    expect(component.convert.emit).toHaveBeenCalledWith(mockIdea);
  });

  it('should hide convert button and show badge if already converted', () => {
    componentRef.setInput('idea', { ...mockIdea, convertedToPostId: 'p1' });
    fixture.detectChanges();
    
    const convertBtn = fixture.nativeElement.querySelector('.convert-btn');
    expect(convertBtn).toBeNull();
    
    const badge = fixture.nativeElement.querySelector('.converted-badge');
    expect(badge).toBeTruthy();
  });
});
