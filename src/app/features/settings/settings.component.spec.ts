import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../core/services/theme.service';
import { DataExportService } from '../../core/services/data-export.service';
import { DataImportService } from '../../core/services/data-import.service';
import { signal } from '@angular/core';
import { ThemePreference } from '../../core/models/settings.model';
import { By } from '@angular/platform-browser';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockDataExportService: jasmine.SpyObj<DataExportService>;
  let mockDataImportService: jasmine.SpyObj<DataImportService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', ['setPreference'], {
      preference: signal<ThemePreference>('system')
    });
    mockDataExportService = jasmine.createSpyObj('DataExportService', ['export']);
    mockDataImportService = jasmine.createSpyObj('DataImportService', ['parseAndValidate', 'import']);

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DataExportService, useValue: mockDataExportService },
        { provide: DataImportService, useValue: mockDataImportService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setPreference onThemeChange', () => {
    component.onThemeChange('dark');
    expect(mockThemeService.setPreference).toHaveBeenCalledWith('dark');
  });

  it('should render theme options', () => {
    const select = fixture.debugElement.query(By.css('app-select'));
    expect(select).toBeTruthy();
    expect(select.attributes['label']).toBe('Tema de la aplicación');
  });

  it('should call exportData on DataExportService when export is triggered', () => {
    component.exportData();
    expect(mockDataExportService.export).toHaveBeenCalled();
  });

  it('should handle successful file selection', fakeAsync(() => {
    const file = new File([''], 'test.json', { type: 'application/json' });
    const event = { target: { files: [file], value: 'test.json' } } as any;
    
    mockDataImportService.parseAndValidate.and.returnValue(Promise.resolve({
      success: true,
      backup: { posts: [{}, {}], ideas: [{}, {}, {}] } as any
    }));

    component.onFileSelected(event);
    tick();

    expect(mockDataImportService.parseAndValidate).toHaveBeenCalledWith(file);
    expect(component.isConfirmDialogOpen).toBeTrue();
    expect(component.confirmMessage).toContain('2 publicaciones');
    expect(component.confirmMessage).toContain('3 ideas');
    expect(event.target.value).toBe('');
  }));

  it('should handle failed file selection', fakeAsync(() => {
    const file = new File([''], 'test.json', { type: 'application/json' });
    const event = { target: { files: [file], value: 'test.json' } } as any;
    
    mockDataImportService.parseAndValidate.and.returnValue(Promise.resolve({
      success: false,
      error: 'Test error message'
    }));

    component.onFileSelected(event);
    tick();

    expect(mockDataImportService.parseAndValidate).toHaveBeenCalledWith(file);
    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(component.importError).toBe('Test error message');
    expect(component.pendingBackup).toBeNull();
  }));

  it('should handle confirm import', () => {
    component.pendingBackup = {} as any;
    component.isConfirmDialogOpen = true;

    component.onConfirmImport();

    expect(mockDataImportService.import).toHaveBeenCalledWith({} as any);
    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(component.pendingBackup).toBeNull();
  });

  it('should handle cancel import', () => {
    component.pendingBackup = {} as any;
    component.isConfirmDialogOpen = true;

    component.onCancelImport();

    expect(mockDataImportService.import).not.toHaveBeenCalled();
    expect(component.isConfirmDialogOpen).toBeFalse();
    expect(component.pendingBackup).toBeNull();
  });
});
