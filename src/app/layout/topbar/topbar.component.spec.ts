import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { ThemeService } from '../../core/services/theme.service';
import { signal } from '@angular/core';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', ['setPreference'], {
      resolvedTheme: signal<'light' | 'dark'>('light')
    });

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme using ThemeService', () => {
    component.toggleTheme();
    expect(mockThemeService.setPreference).toHaveBeenCalledWith('dark');
  });
});
