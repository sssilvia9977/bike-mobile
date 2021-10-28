import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickUserLoginPage } from './pick-user-login.page';

const routes: Routes = [
  {
    path: '',
    component: PickUserLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickUserLoginPageRoutingModule {}
