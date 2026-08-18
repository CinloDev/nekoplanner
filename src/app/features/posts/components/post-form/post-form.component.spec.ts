import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFormComponent } from './post-form.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../../../core/models';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate title required', () => {
    const titleControl = component.form.get('title');
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBeTrue();
  });

  it('should validate min length for title', () => {
    const titleControl = component.form.get('title');
    titleControl?.setValue('ab');
    expect(titleControl?.hasError('minlength')).toBeTrue();
  });

  it('should validate max length for content', () => {
    const contentControl = component.form.get('content');
    const longString = 'a'.repeat(2201);
    contentControl?.setValue(longString);
    expect(contentControl?.hasError('maxlength')).toBeTrue();
  });

  it('should require scheduledDate when status is scheduled', () => {
    const statusControl = component.form.get('status');
    const dateControl = component.form.get('scheduledDate');
    
    // Status = scheduled without date -> invalid
    statusControl?.setValue('scheduled');
    fixture.detectChanges();
    
    expect(dateControl?.hasError('required')).toBeTrue();
    expect(component.form.valid).toBeFalse();
    
    // Changing back to draft makes it valid (ignoring other fields)
    statusControl?.setValue('draft');
    fixture.detectChanges();
    expect(dateControl?.hasError('required')).toBeFalse();
  });

  it('should emit save event with valid form data', () => {
    spyOn(component.save, 'emit');
    
    component.form.patchValue({
      title: 'Valid title',
      content: 'Some content',
      platform: 'instagram',
      status: 'draft'
    });
    
    fixture.detectChanges();
    
    expect(component.form.valid).toBeTrue();
    
    // Trigger submit
    component.onSubmit();
    
    expect(component.save.emit).toHaveBeenCalledWith({
      title: 'Valid title',
      content: 'Some content',
      platform: 'instagram',
      status: 'draft',
      scheduledDate: undefined,
      tags: [],
      media: []
    });
  });

  it('should mark all controls as touched on submit if form is invalid', () => {
    component.form.patchValue({ title: '' }); // Invalid
    component.onSubmit();
    
    expect(component.form.get('title')?.touched).toBeTrue();
    expect(component.form.get('platform')?.touched).toBeTrue();
  });

  it('should emit cancel event when clicking cancel', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should correctly patch initial value if provided', () => {
    const initialPost: Post = {
      id: '123',
      title: 'Existing Post',
      content: 'Existing content',
      platform: 'x',
      status: 'scheduled',
      scheduledDate: '2026-08-18T10:00:00Z',
      createdAt: '2026-08-18T10:00:00Z',
      updatedAt: '2026-08-18T10:00:00Z',
      tags: [],
      media: []
    };
    
    fixture.componentRef.setInput('initialPost', initialPost);
    fixture.detectChanges();
    
    expect(component.form.get('title')?.value).toBe('Existing Post');
    expect(component.form.get('platform')?.value).toBe('x');
    expect(component.form.get('status')?.value).toBe('scheduled');
  });
});
