import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Production } from './pages/production/production';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'production',
    component: Production
  }
];
