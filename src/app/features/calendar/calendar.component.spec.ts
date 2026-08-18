import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { AppStateService } from '../../core/state/app-state.service';
import { Post } from '../../core/models';
import { signal } from '@angular/core';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockAppState: jasmine.SpyObj<AppStateService>;

  beforeEach(async () => {
    // Mocks manuales
    const mockPosts = signal<Post[]>([
      {
        id: '1',
        title: 'Post 1',
        content: '',
        platform: 'x',
        status: 'published',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        scheduledDate: '2026-08-15T10:30:00Z', // Agosto
        tags: []
      },
      {
        id: '2',
        title: 'Post sin scheduled',
        content: '',
        platform: 'x',
        status: 'draft',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        tags: []
      },
      {
        id: '3',
        title: 'Post 3 (Tarde)',
        content: '',
        platform: 'x',
        status: 'scheduled',
        createdAt: '2026-08-10T10:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
        scheduledDate: '2026-08-15T18:00:00Z', // Mismo dia, despues
        tags: []
      }
    ]);

    mockAppState = jasmine.createSpyObj('AppStateService', [], {
      posts: mockPosts
    });

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: AppStateService, useValue: mockAppState }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    
    // Forzamos un mes conocido para no depender del "Hoy" real del sistema
    component.currentMonth.set(new Date('2026-08-01T12:00:00Z'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute visible posts and ignore posts without scheduledDate', () => {
    const posts = component.calendarPosts();
    expect(posts.length).toBe(2);
    expect(posts.find(p => p.id === '2')).toBeUndefined();
  });

  it('should sort posts by scheduledDate correctly within calendarPosts', () => {
    const posts = component.calendarPosts();
    expect(posts[0].id).toBe('1'); // 10:30
    expect(posts[1].id).toBe('3'); // 18:00
  });

  it('should group posts correctly by day', () => {
    // 2026-08-15
    const postsByDay = component.postsByDay();
    // La clave generada usara el format de la timezone local, asumiendo que 12:00Z no se cambia de dia
    let keyFound = false;
    for (const [key, posts] of postsByDay.entries()) {
      if (key.includes('2026-08-15')) {
        keyFound = true;
        expect(posts.length).toBe(2);
      }
    }
    expect(keyFound).withContext('Should have grouped posts in 2026-08-15').toBeTrue();
  });

  it('should navigate to next and previous months', () => {
    const initialMonth = component.currentMonth().getMonth(); // 7 (Agosto)
    
    component.goToNextMonth();
    expect(component.currentMonth().getMonth()).toBe(8); // Septiembre
    
    component.goToPreviousMonth();
    expect(component.currentMonth().getMonth()).toBe(7); // Agosto
  });
});
