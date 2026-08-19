import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsDataService } from './data/analytics-data.service';
import { signal, WritableSignal } from '@angular/core';
import { AnalyticsDistribution, AnalyticsMonthlyPoint } from './models/analytics.model';
import { By } from '@angular/platform-browser';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let mockAnalyticsDataService: Partial<AnalyticsDataService>;

  let mockPostsByStatus: WritableSignal<AnalyticsDistribution[]>;
  let mockPostsByPlatform: WritableSignal<AnalyticsDistribution[]>;
  let mockPostsByMonth: WritableSignal<AnalyticsMonthlyPoint[]>;
  let mockContentFlow: WritableSignal<AnalyticsDistribution[]>;
  let mockCompletedPosts: WritableSignal<number>;

  beforeEach(async () => {
    mockPostsByStatus = signal([]);
    mockPostsByPlatform = signal([]);
    mockPostsByMonth = signal([]);
    mockContentFlow = signal([]);
    mockCompletedPosts = signal(0);

    mockAnalyticsDataService = {
      postsByStatus: mockPostsByStatus,
      postsByPlatform: mockPostsByPlatform,
      postsByMonth: mockPostsByMonth,
      contentFlow: mockContentFlow,
      completedPosts: mockCompletedPosts
    };

    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        { provide: AnalyticsDataService, useValue: mockAnalyticsDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show global empty state when totalPosts is 0', () => {
    mockPostsByStatus.set([]);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state-global'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('Todavía no hay datos suficientes');
  });

  it('should render analytics grid when there are posts', () => {
    mockPostsByStatus.set([{ label: 'Published', count: 5, percentage: 100 }]);
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('.analytics-grid'));
    expect(grid).toBeTruthy();
    
    // Check if KPIs are rendered
    const kpis = fixture.debugElement.queryAll(By.css('app-analytics-kpi-card'));
    expect(kpis.length).toBe(4);
  });
});
