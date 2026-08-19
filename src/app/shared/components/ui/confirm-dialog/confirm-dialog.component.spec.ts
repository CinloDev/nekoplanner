import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('title', 'Eliminar');
    fixture.componentRef.setInput('message', '¿Estás seguro?');
    fixture.componentRef.setInput('isOpen', true);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('#dialog-title')).nativeElement;
    const msgEl = fixture.debugElement.query(By.css('#dialog-message')).nativeElement;
    
    expect(titleEl.textContent).toContain('Eliminar');
    expect(msgEl.textContent).toContain('¿Estás seguro?');
  });

  it('should emit cancel event on Cancel button click', () => {
    spyOn(component.cancel, 'emit');
    const cancelBtn = fixture.debugElement.query(By.css('app-button[variant="secondary"]')).nativeElement;
    cancelBtn.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should emit confirm event on Confirm button click', () => {
    spyOn(component.confirm, 'emit');
    // Using nth-child or specific attributes to find confirm button
    const confirmBtn = fixture.debugElement.queryAll(By.directive(ConfirmDialogComponent))[0]?.queryAll(By.css('app-button'))[1];
    // Or simpler:
    const buttons = fixture.debugElement.queryAll(By.css('app-button'));
    buttons[1].nativeElement.click();
    
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event on backdrop click', () => {
    spyOn(component.cancel, 'emit');
    const backdrop = fixture.debugElement.query(By.css('.dialog-backdrop')).nativeElement;
    backdrop.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should not emit cancel event on dialog content click', () => {
    spyOn(component.cancel, 'emit');
    const dialog = fixture.debugElement.query(By.css('.confirm-dialog')).nativeElement;
    dialog.click();
    expect(component.cancel.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event on Escape keypress', () => {
    spyOn(component.cancel, 'emit');
    component.onEscape();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
