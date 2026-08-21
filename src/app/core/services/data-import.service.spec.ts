import { TestBed } from '@angular/core/testing';
import { DataImportService } from './data-import.service';
import { AppStateService } from '../state/app-state.service';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from './theme.service';

describe('DataImportService', () => {
  let service: DataImportService;
  let mockAppState: jasmine.SpyObj<AppStateService>;
  let mockStorage: jasmine.SpyObj<StorageService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(() => {
    mockAppState = jasmine.createSpyObj('AppStateService', ['importData']);
    mockStorage = jasmine.createSpyObj('StorageService', ['save']);
    mockThemeService = jasmine.createSpyObj('ThemeService', ['recalculateTheme']);

    TestBed.configureTestingModule({
      providers: [
        DataImportService,
        { provide: AppStateService, useValue: mockAppState },
        { provide: StorageService, useValue: mockStorage },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    });
    
    service = TestBed.inject(DataImportService);
  });

  const createMockFile = (content: string, type: string = 'application/json') => {
    return new File([content], 'test.json', { type });
  };

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('parseAndValidate', () => {
    it('should reject invalid JSON', async () => {
      const file = createMockFile('invalid json string');
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El archivo no contiene un JSON válido.');
      }
    });

    it('should reject arrays or primitives as root', async () => {
      const file = createMockFile('[]');
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El backup no tiene una estructura válida.');
      }
    });

    it('should reject wrong version', async () => {
      const file = createMockFile(JSON.stringify({ version: 2 }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('La versión del backup no es compatible.');
      }
    });

    it('should reject invalid exportedAt', async () => {
      const file = createMockFile(JSON.stringify({ version: 1, exportedAt: 'invalid date' }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El backup no tiene un timestamp válido de exportación.');
      }
    });

    it('should reject missing arrays for posts or ideas', async () => {
      const file = createMockFile(JSON.stringify({ version: 1, exportedAt: new Date().toISOString() }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El backup no tiene listas de publicaciones o ideas válidas.');
      }
    });

    it('should reject invalid posts', async () => {
      const file = createMockFile(JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        posts: [{ id: 'p1' }], // Missing title, platform, status
        ideas: [],
        settings: { theme: 'system', navigation: 'sidebar' }
      }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El backup contiene publicaciones con estructura inválida.');
      }
    });

    it('should reject duplicate IDs within posts', async () => {
      const file = createMockFile(JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        posts: [
          { id: 'p1', title: 'A', platform: 'twitter', status: 'draft' },
          { id: 'p1', title: 'B', platform: 'linkedin', status: 'draft' }
        ],
        ideas: [],
        settings: { theme: 'system', navigation: 'sidebar' }
      }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El backup contiene IDs duplicados.');
      }
    });

    it('should reject invalid settings', async () => {
      const file = createMockFile(JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        posts: [],
        ideas: [],
        settings: { theme: 'invalid', navigation: 'sidebar' }
      }));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error).toBe('El tema (theme) especificado en los ajustes del backup es inválido.');
      }
    });

    it('should accept valid backup', async () => {
      const validBackup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        posts: [{ id: 'p1', title: 'A', platform: 'twitter', status: 'draft' }],
        ideas: [{ id: 'i1', title: 'Idea 1' }],
        settings: { theme: 'system', navigation: 'sidebar' }
      };
      const file = createMockFile(JSON.stringify(validBackup));
      const result = await service.parseAndValidate(file);
      expect(result.success).toBeTrue();
    });
  });

  describe('import', () => {
    it('should call AppStateService, persist data, and set theme', () => {
      const backup: any = {
        posts: [{ id: 'p1' }],
        ideas: [],
        settings: { theme: 'dark', navigation: 'sidebar' }
      };

      service.import(backup);

      expect(mockAppState.importData).toHaveBeenCalledWith(backup);
      expect(mockThemeService.recalculateTheme).toHaveBeenCalled();
    });
  });
});
