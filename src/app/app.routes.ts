import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn }
];
