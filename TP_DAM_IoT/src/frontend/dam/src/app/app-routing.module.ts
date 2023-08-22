import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dispositivos',
    loadChildren: () => import('./dispositivos/dispositivos.module').then( m => m.DispositivosPageModule)
  },
  {
    path: 'mediciones',
    loadChildren: () => import('./mediciones/mediciones.module').then( m => m.MedicionesPageModule)
  },
  {
    path: 'mediciones/:id',
    loadChildren: () => import('./mediciones/mediciones.module').then( m => m.MedicionesPageModule)
  },
  {
    path: 'logriego',
    loadChildren: () => import('./logriego/logriego.module').then( m => m.LogriegoPageModule)
  },
  {
    path: 'logriego/:id',
    loadChildren: () => import('./logriego/logriego.module').then( m => m.LogriegoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
