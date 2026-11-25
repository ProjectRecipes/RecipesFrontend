import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Profile } from './profile.component';
import { EditProfile } from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path: '', component: Profile },
  { path: 'edit', component: EditProfile },
  { path: ':username', component: Profile },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
