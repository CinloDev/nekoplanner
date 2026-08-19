import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../core/services/theme.service';
import { DataExportService } from '../../core/services/data-export.service';
import { signal } from '@angular/core';
import { ThemePreference } from '../../core/models/settings.model';
import { By } from '@angular/platform-browser';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockDataExportService: jasmine.SpyObj<DataExportService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', ['setPreference'], {
      preference: signal<ThemePreference>('system')
    });
    mockDataExportService = jasmine.createSpyObj('DataExportService', ['export']);

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DataExportService, useValue: mockDataExportService }
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
});
