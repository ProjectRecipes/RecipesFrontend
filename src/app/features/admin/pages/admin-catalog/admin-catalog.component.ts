import { Component } from '@angular/core';
import { CATALOGS } from '../../models/catalog-item.model';

@Component({
  selector: 'app-admin-catalog',
  standalone: false,
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss',
})
export class AdminCatalog {
  readonly catalogs = CATALOGS;
}
