import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteResolver } from './route.resolver';

const routes: Routes = [
  {
    path: 'quiz/home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'quiz/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'quiz/dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    resolve: {
      routeResolver: RouteResolver
    },
  },
  {
    path: 'quiz/questions',
    loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsPageModule)
  },
  {
    path: 'quiz/summary',
    loadChildren: () => import('./summary/summary.module').then(m => m.SummaryPageModule)
  },
  {
    path: 'quiz/pop-ups',
    loadChildren: () => import('./dialogs/pop-ups/pop-ups.module').then(m => m.PopUpsPageModule)
  },
  {
    path: 'quiz/leaderboard',
    loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [RouteResolver]
})
export class AppRoutingModule { }
