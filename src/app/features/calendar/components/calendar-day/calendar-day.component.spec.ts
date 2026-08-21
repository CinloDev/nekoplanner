import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarDayComponent } from './calendar-day.component';
import { Post } from '@core/models';
import { PLATFORM_META } from '@core/config/platforms.config';

describe('CalendarDayComponent', () => {
  let component: CalendarDayComponent;
  let fixture: ComponentFixture<CalendarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarDayComponent);
    component = fixture.componentInstance;
    component.date = new Date('2026-08-15T12:00:00Z');
    component.referenceMonth = new Date('2026-08-01T12:00:00Z');
    component.today = new Date('2026-08-15T12:00:00Z');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle day without posts', () => {
    component.posts = [];
    fixture.detectChanges();
    expect(component.displayIcons().length).toBe(0);
    expect(component.extraCount()).toBe(0);
  });

  it('should display up to 3 icons and calculate extraCount correctly', () => {
    component.posts = [
      { id: '1', platform: 'x' } as Post,
      { id: '2', platform: 'instagram' } as Post,
      { id: '3', platform: 'linkedin' } as Post,
      { id: '4', platform: 'tiktok' } as Post,
      { id: '5', platform: 'x' } as Post
    ];
    fixture.detectChanges();
    
    const icons = component.displayIcons();
    expect(icons.length).toBe(3);
    expect(icons[0].platform).toBe('x');
    expect(icons[1].platform).toBe('instagram');
    expect(icons[2].platform).toBe('linkedin');
    expect(component.extraCount()).toBe(2);
  });

  it('should use PLATFORM_META to resolve icons', () => {
    component.posts = [{ id: '1', platform: 'youtube' } as Post];
    fixture.detectChanges();
    
    const icons = component.displayIcons();
    expect(icons.length).toBe(1);
    expect(icons[0].icon).toBe(PLATFORM_META['youtube'].icon);
  });

  it('should emit daySelected on click', () => {
    spyOn(component.daySelected, 'emit');
    fixture.detectChanges();
    
    component.onDayClick();
    expect(component.daySelected.emit).toHaveBeenCalledWith(component.date);
  });

  it('should apply isSelected class when isSelected is true', () => {
    component.isSelected = true;
    fixture.detectChanges();
    
    const el = fixture.nativeElement.querySelector('.calendar-day');
    expect(el.classList.contains('is-selected')).toBeTrue();
  });
});
