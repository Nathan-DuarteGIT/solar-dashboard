import { Component, inject, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import { solarPanelStore } from '../../stores/solar-panel.store';
import { SolarPanel } from '../../interfaces/solar-panel.interface';
import { PanelDialog } from '../../components/panel-dialog/panel-dialog';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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
  dialog = inject(MatDialog);
  solarPanelStore = inject(solarPanelStore);

  ngOnInit() {
    this.solarPanelStore.loadDasboardData();
  }

  viewMode = signal<'table' | 'chart'>('table');

  panels = this.solarPanelStore.panels;
  

  displayedColumns: string[] = ['id', 'location', 'capacity', 'production', 'status', 'actions'];

  async openPanelDialog(panel?: SolarPanel) {
    const dialogRef = this.dialog.open(PanelDialog, {
      width: '450px',
      data: panel ? { ...panel } : null
    });

    const formData = await firstValueFrom(dialogRef.afterClosed());

    if (formData) {
      if (panel) {
        this.solarPanelStore.updatePanel(panel.id, formData);
      } else {
        this.solarPanelStore.addPanel(formData);
      }
    }
    
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
