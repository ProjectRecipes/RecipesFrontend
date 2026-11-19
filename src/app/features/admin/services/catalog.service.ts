import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CatalogItem, CatalogType } from '../models/catalog-item.model';

// Temporary mock data until the backend is ready.
// Later each method will call the backend API with HttpClient.
const INITIAL_DATA: Record<CatalogType, string[]> = {
  'meal-types': ['Breakfast', 'Lunch', 'Dinner', 'Main course', 'Appetizer', 'Salad', 'Dessert', 'Drink'],
  'dish-types': ['Soup', 'Stew', 'Pasta', 'Pizza', 'Sandwich', 'Burger', 'Risotto', 'Meat dish',
    'Fish dish', 'Vegetable dish', 'Bakery product', 'Cake', 'Torte', 'Pancakes'],
  'diet-types': ['Vegetarian', 'Vegan', 'Fasting', 'Non-fasting', 'Raw food', 'Pescatarian'],
  'ingredient-categories': ['Vegetables', 'Fruit', 'Meat', 'Fish', 'Dairy products', 'Grains',
    'Spices', 'Nuts'],
  'allergens': ['Milk', 'Gluten', 'Peanuts', 'Eggs', 'Soy', 'Tree nuts', 'Fish', 'Shellfish'],
};

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private nextId = 1;
  private readonly data = new Map<CatalogType, BehaviorSubject<CatalogItem[]>>();

  constructor() {
    (Object.keys(INITIAL_DATA) as CatalogType[]).forEach((type) => {
      const items = INITIAL_DATA[type].map((name) => ({ id: this.nextId++, name }));
      this.data.set(type, new BehaviorSubject<CatalogItem[]>(items));
    });
  }

  getAll(type: CatalogType): Observable<CatalogItem[]> {
    return this.subject(type).asObservable();
  }

  create(type: CatalogType, item: Omit<CatalogItem, 'id'>): Observable<CatalogItem> {
    const created: CatalogItem = { ...item, id: this.nextId++ };
    this.subject(type).next([...this.subject(type).value, created]);
    return of(created);
  }

  update(type: CatalogType, item: CatalogItem): Observable<CatalogItem> {
    const items = this.subject(type).value.map((i) => (i.id === item.id ? item : i));
    this.subject(type).next(items);
    return of(item);
  }

  delete(type: CatalogType, id: number): Observable<void> {
    this.subject(type).next(this.subject(type).value.filter((i) => i.id !== id));
    return of(undefined);
  }

  private subject(type: CatalogType): BehaviorSubject<CatalogItem[]> {
    return this.data.get(type)!;
  }
}
