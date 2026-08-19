import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformDistributionComponent } from './platform-distribution.component';
import { ComponentRef } from '@angular/core';

describe('PlatformDistributionComponent', () => {
  let component: PlatformDistributionComponent;
  let fixture: ComponentFixture<PlatformDistributionComponent>;
  let componentRef: ComponentRef<PlatformDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformDistributionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformDistributionComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    componentRef.setInput('data', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle zero state', () => {
    componentRef.setInput('data', [{ label: 'X', count: 0, percentage: 0 }]);
    fixture.detectChanges();
    
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('0 publicaciones');
  });

  it('should render data bars', () => {
    componentRef.setInput('data', [{ label: 'X', count: 10, percentage: 100 }]);
    fixture.detectChanges();
    
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('0 publicaciones');
    expect(element.querySelector('svg')).toBeTruthy();
    expect(element.querySelector('text.label-text')?.textContent).toContain('X');
    expect(element.querySelector('text.value-text')?.textContent).toContain('10 (100%)');
  });
});
