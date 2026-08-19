import { TestBed } from '@angular/core/testing';
import { DataExportService } from './data-export.service';
import { AppStateService } from '../state/app-state.service';
import { signal } from '@angular/core';
import { Post, Idea, Settings } from '../models';

describe('DataExportService', () => {
  let service: DataExportService;
  let mockAppState: jasmine.SpyObj<AppStateService>;

  beforeEach(() => {
    mockAppState = jasmine.createSpyObj('AppStateService', ['posts', 'ideas', 'settings']);
    
    mockAppState.posts.and.returnValue([{ id: 'p1', title: 'Post 1' } as Post]);
    mockAppState.ideas.and.returnValue([{ id: 'i1', title: 'Idea 1' } as Idea]);
    mockAppState.settings.and.returnValue({ theme: 'system', navigation: 'sidebar' } as Settings);

    TestBed.configureTestingModule({
      providers: [
        DataExportService,
        { provide: AppStateService, useValue: mockAppState }
      ]
    });
    
    service = TestBed.inject(DataExportService);

    // Mock URL.createObjectURL and URL.revokeObjectURL
    spyOn(URL, 'createObjectURL').and.returnValue('blob:fake-url');
    spyOn(URL, 'revokeObjectURL');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create a correctly structured backup and trigger download', () => {
    // Spy on document.createElement and appendChild/click
    const aElement = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(aElement);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(aElement, 'click');

    service.export();

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(aElement.href).toBe('http://localhost:9876/blob:fake-url'); // Depending on test runner base
    expect(aElement.download).toBe('neko-planner-backup.json');
    expect(document.body.appendChild).toHaveBeenCalledWith(aElement);
    expect(aElement.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(aElement);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');

    // We can also intercept the Blob to check the content and MIME type
    const createObjectUrlCall = (URL.createObjectURL as jasmine.Spy).calls.first();
    const blob = createObjectUrlCall.args[0] as Blob;
    
    expect(blob.type).toBe('application/json');
    
    return blob.text().then(text => {
      const json = JSON.parse(text);
      expect(json.version).toBe(1);
      expect(json.exportedAt).toBeDefined();
      expect(json.posts).toEqual([{ id: 'p1', title: 'Post 1' }]);
      expect(json.ideas).toEqual([{ id: 'i1', title: 'Idea 1' }]);
      expect(json.settings).toEqual({ theme: 'system', navigation: 'sidebar' });
      
      // Verify pretty-printed format by checking if it contains newlines and spaces
      expect(text).toContain('{\n  "version": 1,\n');
    });
  });
});
