import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogService);
  });

  it('should load initial allergens', async () => {
    const items = await firstValueFrom(service.getAll('allergens'));
    expect(items.length).toBeGreaterThan(0);
  });

  it('should add, update and delete an item', async () => {
    const created = await firstValueFrom(service.create('allergens', { name: 'Sesame' }));
    await firstValueFrom(service.update('allergens', { ...created, name: 'Sesame seeds' }));
    let items = await firstValueFrom(service.getAll('allergens'));
    expect(items.some((i) => i.name === 'Sesame seeds')).toBe(true);

    await firstValueFrom(service.delete('allergens', created.id));
    items = await firstValueFrom(service.getAll('allergens'));
    expect(items.some((i) => i.id === created.id)).toBe(false);
  });
});
