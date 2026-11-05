import { Component, inject } from '@angular/core';
import { ActionCards } from '../../components/action-cards/action-cards';
import { Router } from '@angular/router';

@Component({
  imports: [ActionCards],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  router = inject(Router);

  goToProduction(){
    this.router.navigate(['/production']);
  }
}
