import { Component, inject, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {SolarPanelService} from '../../services/solar-panel.service';
import { solarPanelStore } from '../../stores/solar-panel.store';

@Component({
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule, 
    MatCardModule
  ],
  standalone: true,
  selector: 'app-production',
  styleUrl: './production.scss',
  templateUrl: './production.html',
})
export class Production {
  solarPanelStore = inject(solarPanelStore);

  ngOnInit() {
    this.solarPanelStore.loadDasboardData();
  }

  viewMode = signal<'table' | 'chart'>('table');

  panels = this.solarPanelStore.panels;
  

  displayedColumns: string[] = ['id', 'location', 'capacity', 'production', 'status', 'actions'];

  addPanel() {
    console.log('Add clicked');
  }

  editPanel(panel: any) {
    console.log('edit', panel);
  }
  
  async deletePanel(id: string) {
    const isConfirmed = window.confirm('Are you sure you want to delete this panel?');

    if (isConfirmed) {
      try {
        await this.solarPanelStore.deletePanel(id);
      } catch (err) {
        console.error('Error deleting panel:', err);
      }
    }
  }

}
