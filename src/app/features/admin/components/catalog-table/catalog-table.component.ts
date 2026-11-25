import { AfterViewInit, Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter, switchMap } from 'rxjs';

import { CatalogItem, CatalogType } from '../../models/catalog-item.model';
import { CatalogService } from '../../services/catalog.service';
import { CatalogDialog, CatalogDialogData } from '../catalog-dialog/catalog-dialog.component';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-catalog-table',
  standalone: false,
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss',
})
export class CatalogTable implements OnInit, AfterViewInit {
  @Input({ required: true }) type!: CatalogType;
  @Input({ required: true }) label!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly catalogService = inject(CatalogService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['name', 'description', 'actions'];
  readonly dataSource = new MatTableDataSource<CatalogItem>([]);

  ngOnInit(): void {
    this.catalogService
      .getAll(this.type)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => (this.dataSource.data = items));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.paginator.firstPage();
  }

  openAdd(): void {
    this.openDialog().subscribe();
  }

  openEdit(item: CatalogItem): void {
    this.openDialog(item).subscribe();
  }

  confirmDelete(item: CatalogItem): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Delete item',
          message: `Are you sure you want to delete "${item.name}"?`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.catalogService.delete(this.type, item.id)),
      )
      .subscribe();
  }

  private openDialog(item?: CatalogItem) {
    return this.dialog
      .open<CatalogDialog, CatalogDialogData, CatalogItem>(CatalogDialog, {
        data: {
          label: this.label,
          item,
          existingNames: this.dataSource.data.map((i) => i.name),
        },
      })
      .afterClosed()
      .pipe(
        filter((result): result is CatalogItem => !!result),
        switchMap((result) =>
          item ? this.catalogService.update(this.type, result) : this.catalogService.create(this.type, result),
        ),
      );
  }
}
