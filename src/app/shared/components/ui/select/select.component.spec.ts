import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [SelectComponent],
  template: `
    <app-select
      [label]="label()"
      [placeholder]="placeholder()"
      [options]="options()"
      [value]="value()"
      [disabled]="disabled()"
      [error]="error()"
      (valueChange)="onValueChange($event)"
    ></app-select>
  `
})
class TestHostComponent {
  label = signal('Platform');
  placeholder = signal('Select...');
  options = signal<SelectOption<string>[]>([
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ]);
  value = signal<string | null>(null);
  disabled = signal(false);
  error = signal('');
  
  onValueChange(val: string | null) {
    this.value.set(val);
  }
}

describe('SelectComponent', () => {
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

  it('should render label and placeholder when no value is selected', () => {
    const labelEl = fixture.debugElement.query(By.css('.select-label')).nativeElement;
    const triggerEl = fixture.debugElement.query(By.css('.selected-text')).nativeElement;
    
    expect(labelEl.textContent.trim()).toBe('Platform');
    expect(triggerEl.textContent.trim()).toBe('Select...');
  });

  it('should display selected option label', () => {
    component.value.set('opt2');
    fixture.detectChanges();
    
    const triggerEl = fixture.debugElement.query(By.css('.selected-text')).nativeElement;
    expect(triggerEl.textContent.trim()).toBe('Option 2');
  });

  it('should toggle dropdown on trigger click', () => {
    const triggerBtn = fixture.debugElement.query(By.css('.select-trigger')).nativeElement;
    
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeNull();
    
    triggerBtn.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeTruthy();
    
    triggerBtn.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeNull();
  });

  it('should emit valueChange and close dropdown on option click', () => {
    const triggerBtn = fixture.debugElement.query(By.css('.select-trigger')).nativeElement;
    triggerBtn.click();
    fixture.detectChanges();
    
    const options = fixture.debugElement.queryAll(By.css('.select-option'));
    options[1].nativeElement.click(); // Click Option 2
    fixture.detectChanges();
    
    expect(component.value()).toBe('opt2');
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeNull(); // Closed
  });

  it('should handle keyboard navigation (ArrowDown, ArrowUp, Enter)', () => {
    const selectDebug = fixture.debugElement.query(By.directive(SelectComponent));
    
    // Open via Enter
    selectDebug.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeTruthy();

    // Navigate down
    selectDebug.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    
    // Select via Enter
    selectDebug.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    
    expect(component.value()).toBe('opt2'); // ArrowDown moves from 0 to 1
  });

  it('should not open if disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    
    const triggerBtn = fixture.debugElement.query(By.css('.select-trigger')).nativeElement;
    triggerBtn.click();
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('.select-dropdown'))).toBeNull();
  });
});
