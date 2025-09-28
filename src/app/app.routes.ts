import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { Layout } from './components/layout/layout';
import { Home } from './pages/app/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Home },
      { path: 'home', redirectTo: '', pathMatch: 'full' }
    ]
  }
];
