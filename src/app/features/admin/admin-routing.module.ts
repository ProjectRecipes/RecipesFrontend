import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCatalog } from './pages/admin-catalog/admin-catalog.component';

const routes: Routes = [{ path: '', component: AdminCatalog }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
