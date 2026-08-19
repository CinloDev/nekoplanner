import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { getToday } from '@core/utils/calendar/calendar.utils';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close popover', () => {
    expect(component.isOpen()).toBeFalse();
    component.toggleOpen();
    expect(component.isOpen()).toBeTrue();
    component.close();
    expect(component.isOpen()).toBeFalse();
  });

  it('should emit null when clearing', () => {
    spyOn(component.valueChange, 'emit');
    component.clear(new Event('click'));
    expect(component.valueChange.emit).toHaveBeenCalledWith(null);
  });

  it('should format correctly from initial value', () => {
    const d = new Date(2026, 7, 21, 10, 30); // 21 Ago 2026 10:30
    fixture.componentRef.setInput('value', d.toISOString());
    fixture.detectChanges();
    
    expect(component.selectedDate()?.getDate()).toBe(21);
    expect(component.selectedHour()).toBe(10);
    expect(component.selectedMinute()).toBe(30);
  });

  it('should emit new date when selecting day', () => {
    spyOn(component.valueChange, 'emit');
    const today = getToday();
    component.selectDay(today);
    
    expect(component.valueChange.emit).toHaveBeenCalled();
  });

  it('should close on click outside', () => {
    component.isOpen.set(true);
    component.onClickOutside(new Event('click'));
    expect(component.isOpen()).toBeFalse();
  });

  it('should close on Escape', () => {
    component.isOpen.set(true);
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeydown(event);
    expect(component.isOpen()).toBeFalse();
  });
});
