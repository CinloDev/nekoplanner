import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `
    <app-input
      [label]="label()"
      [placeholder]="placeholder()"
      [value]="value()"
      [disabled]="disabled()"
      [error]="error()"
      (valueChange)="onValueChange($event)"
    ></app-input>
  `
})
class TestHostComponent {
  label = signal('Search');
  placeholder = signal('Type here...');
  value = signal('Initial');
  disabled = signal(false);
  error = signal('');
  
  onValueChange(val: string) {
    this.value.set(val);
  }
}

describe('InputComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render label and placeholder', () => {
    const labelEl = fixture.debugElement.query(By.css('label')).nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    
    expect(labelEl.textContent.trim()).toBe('Search');
    expect(inputEl.placeholder).toBe('Type here...');
    expect(inputEl.value).toBe('Initial');
  });

  it('should emit valueChange on input', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    
    inputEl.value = 'New value';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.value()).toBe('New value');
  });

  it('should bind disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.disabled).toBeTrue();
  });

  it('should render error message and add invalid aria attribute', () => {
    component.error.set('Invalid field');
    fixture.detectChanges();
    
    const errorEl = fixture.debugElement.query(By.css('.input-error')).nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    
    expect(errorEl.textContent.trim()).toBe('Invalid field');
    expect(inputEl.getAttribute('aria-invalid')).toBe('true');
  });
});
