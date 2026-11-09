import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  imports: [MatCardModule, MatChipsModule],
  standalone: true,
  selector: 'app-action-cards',
  styleUrl: './action-cards.scss',
  templateUrl: './action-cards.html',
})
export class ActionCards {
  title = input.required<string>();
  description = input.required<string>();
  icon = input.required<string>();
  chipText = input.required<string>();
  isDisabled = input<boolean>(false);
}
