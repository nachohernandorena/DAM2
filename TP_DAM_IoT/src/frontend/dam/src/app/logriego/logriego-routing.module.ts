import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogriegoPage } from './logriego.page';

const routes: Routes = [
  {
    path: '',
    component: LogriegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogriegoPageRoutingModule {}
