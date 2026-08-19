import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeaFormComponent } from './idea-form.component';
import { ComponentRef } from '@angular/core';
import { Idea } from '@core/models';

describe('IdeaFormComponent', () => {
  let component: IdeaFormComponent;
  let fixture: ComponentFixture<IdeaFormComponent>;
  let componentRef: ComponentRef<IdeaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeaFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    // Default: creation mode (null initial idea)
    componentRef.setInput('initialIdea', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('should initialize empty form for Create mode', () => {
    expect(component.form.value).toEqual({
      title: '',
      content: '',
      tags: ''
    });
    expect(component.form.valid).toBeFalse();
  });

  it('should require title', () => {
    const titleCtrl = component.form.get('title');
    expect(titleCtrl?.valid).toBeFalse();
    expect(titleCtrl?.hasError('required')).toBeTrue();
    
    titleCtrl?.setValue('ab'); // less than 3
    expect(titleCtrl?.hasError('minlength')).toBeTrue();
    
    titleCtrl?.setValue('Valid Title');
    expect(titleCtrl?.valid).toBeTrue();
  });

  it('should initialize form with initialIdea for Edit mode', () => {
    const mockIdea: Idea = {
      id: '1',
      title: 'Edit Me',
      content: 'Old content',
      createdAt: '',
      updatedAt: '',
      tags: [{ id: 't1', name: 'angular' }, { id: 't2', name: 'rxjs' }]
    };

    componentRef.setInput('initialIdea', mockIdea);
    fixture.detectChanges();

    expect(component.form.value.title).toBe('Edit Me');
    expect(component.form.value.content).toBe('Old content');
    expect(component.form.value.tags).toBe('angular, rxjs');
  });

  it('should emit save with parsed values when valid', () => {
    spyOn(component.save, 'emit');
    
    component.form.setValue({
      title: 'New Idea',
      content: 'Some notes',
      tags: 'frontend, javascript'
    });
    
    expect(component.form.valid).toBeTrue();
    component.onSubmit();
    
    expect(component.save.emit).toHaveBeenCalled();
    const emittedValue = (component.save.emit as any).calls.first().args[0];
    
    expect(emittedValue.title).toBe('New Idea');
    expect(emittedValue.content).toBe('Some notes');
    expect(emittedValue.tags.length).toBe(2);
    expect(emittedValue.tags[0].name).toBe('frontend');
    expect(emittedValue.tags[1].name).toBe('javascript');
  });

  it('should not emit save when form is invalid', () => {
    spyOn(component.save, 'emit');
    
    component.form.setValue({
      title: '', // invalid
      content: '',
      tags: ''
    });
    
    component.onSubmit();
    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.form.get('title')?.touched).toBeTrue();
  });

  it('should emit cancel event', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
