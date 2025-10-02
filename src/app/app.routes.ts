import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { Layout } from './components/layout/layout';
import { Home } from './pages/app/home/home';
import { authGuard } from './guards/auth.guard';
import {Messages} from './pages/app/messages/messages';
import { Profile } from './pages/app/profile/profile';
import { Search } from './pages/app/search/search';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Home },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: 'messages', component: Messages },
      { path: 'profile', component: Profile },
      { path: 'profile/:userId', component: Profile }, // Pour voir le profil d'autres utilisateurs
      { path: 'search', component: Search },
    ]
  }
];
