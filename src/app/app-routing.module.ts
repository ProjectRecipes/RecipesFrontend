import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
<<<<<<< HEAD
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule),
=======
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
>>>>>>> origin/develop
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
