import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopUpsPage } from './pop-ups.page';

const routes: Routes = [
  {
    path: '',
    component: PopUpsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopUpsPageRoutingModule {}
