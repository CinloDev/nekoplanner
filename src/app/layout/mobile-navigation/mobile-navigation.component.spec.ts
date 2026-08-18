import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileNavigationComponent } from './mobile-navigation.component';
import { ActivatedRoute } from '@angular/router';

describe('MobileNavigationComponent', () => {
  let component: MobileNavigationComponent;
  let fixture: ComponentFixture<MobileNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavigationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
