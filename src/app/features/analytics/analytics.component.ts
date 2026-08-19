import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDataService } from './data/analytics-data.service';
import { AnalyticsKpiCardComponent } from './components/analytics-kpi-card/analytics-kpi-card.component';
import { PlatformDistributionComponent } from './components/platform-distribution/platform-distribution.component';
import { StatusDistributionComponent } from './components/status-distribution/status-distribution.component';
import { MonthlyTrendComponent } from './components/monthly-trend/monthly-trend.component';
import { ContentFlowComponent } from './components/content-flow/content-flow.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule, 
    AnalyticsKpiCardComponent,
    PlatformDistributionComponent,
    StatusDistributionComponent,
    MonthlyTrendComponent,
    ContentFlowComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
  readonly analyticsData = inject(AnalyticsDataService);

  readonly totalPosts = computed(() => {
    return this.analyticsData.postsByStatus().reduce((acc, curr) => acc + curr.count, 0);
  });

  readonly completedPosts = this.analyticsData.completedPosts;

  readonly scheduledPosts = computed(() => {
    const pipeline = this.analyticsData.contentFlow().find(f => f.label === 'Pipeline');
    return pipeline ? pipeline.count : 0;
  });

  readonly completedPercentage = computed(() => {
    const total = this.totalPosts();
    return total > 0 ? Math.round((this.completedPosts() / total) * 100) : 0;
  });
}
