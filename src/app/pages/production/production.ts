import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { solarPanelStore } from '../../stores/solar-panel.store';
import { SolarPanel } from '../../interfaces/solar-panel.interface';
import { PanelDialog } from '../../components/panel-dialog/panel-dialog';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    BaseChartDirective,
    MatProgressSpinnerModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  standalone: true,
  selector: 'app-production',
  styleUrl: './production.scss',
  templateUrl: './production.html',
})
export class Production implements OnInit {
  dialog = inject(MatDialog);
  solarPanelStore = inject(solarPanelStore);

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 25,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    },
    plugins: {
      tooltip: { enabled: true }
    }
  };

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
