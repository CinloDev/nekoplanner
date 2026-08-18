import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { STORAGE_NAMESPACE, StorageKeys } from './storage-keys';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    spyOn(console, 'error'); // Suppress expected error logs from the test output

    // Mock localStorage
    let store: Record<string, string> = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value + '');
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => delete store[key]);
    spyOn(localStorage, 'clear').and.callFake(() => store = {});
    
    // We need to mock localStorage.length and localStorage.key for clear() and exportData()
    Object.defineProperty(localStorage, 'length', {
      get: () => Object.keys(store).length,
      configurable: true
    });
    spyOn(localStorage, 'key').and.callFake((i: number) => Object.keys(store)[i] || null);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and load a simple value', () => {
    service.save(StorageKeys.SETTINGS, { theme: 'dark' });
    const loaded = service.load<{ theme: string }>(StorageKeys.SETTINGS);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(StorageKeys.SETTINGS, '{"theme":"dark"}');
    expect(loaded).toEqual({ theme: 'dark' });
  });

  it('should return null when loading a non-existent key', () => {
    const loaded = service.load('non-existent');
    expect(loaded).toBeNull();
  });

  it('should return null when JSON is invalid', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid json');
    const loaded = service.load(StorageKeys.SETTINGS);
    expect(loaded).toBeNull();
  });

  it('should remove a specific key', () => {
    service.save(StorageKeys.POSTS, []);
    expect(service.load(StorageKeys.POSTS)).toEqual([]);
    
    service.remove(StorageKeys.POSTS);
    expect(localStorage.removeItem).toHaveBeenCalledWith(StorageKeys.POSTS);
    expect(service.load(StorageKeys.POSTS)).toBeNull();
  });

  it('should only clear keys in the nekoplanner namespace', () => {
    localStorage.setItem('other-app-key', 'data');
    service.save(StorageKeys.POSTS, []);
    service.save(StorageKeys.IDEAS, []);

    service.clear();

    expect(localStorage.removeItem).toHaveBeenCalledWith(StorageKeys.POSTS);
    expect(localStorage.removeItem).toHaveBeenCalledWith(StorageKeys.IDEAS);
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('other-app-key');
  });

  it('should reject invalid JSON during import', () => {
    const result = service.importData('invalid json');
    expect(result.success).toBeFalse();
    expect(result.error).toContain('parsear');
  });

  it('should reject non-object JSON during import', () => {
    const result = service.importData('[]');
    expect(result.success).toBeFalse();
    expect(result.error).toContain('Estructura JSON inválida');
  });

  it('should reject JSON without nekoplanner keys during import', () => {
    const result = service.importData('{"some-other-key": "value"}');
    expect(result.success).toBeFalse();
    expect(result.error).toContain('No se encontraron datos válidos');
  });

  it('should successfully import valid data', () => {
    const validData = {
      [StorageKeys.POSTS]: [{ id: '1', title: 'Test Post' }]
    };
    
    const result = service.importData(JSON.stringify(validData));
    
    expect(result.success).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith(StorageKeys.POSTS, JSON.stringify(validData[StorageKeys.POSTS]));
    expect(service.load<any[]>(StorageKeys.POSTS)![0].title).toBe('Test Post');
  });
});
