import { Component, inject, signal, OnInit } from '@angular/core';
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
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    BaseChartDirective
  ],
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

  barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const productionData = this.solarPanelStore.productionData();
    const labels = productionData.map(data => `H${data.hour}`);
    const dataValues = productionData.map(data => data.production);
    const backgroundColors = productionData.map(data => {
      switch (data.type) {
        case 'production': return 'rgba(39, 174, 96, 0.8)'; // Green
        case 'limited': return 'rgba(155, 89, 182, 0.8)'; // purple
        case 'idle': return 'rgba(52, 152, 219, 0.8)'; // Blue
        default: return 'rgba(0, 0, 0, 0.1)'; // Default color
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          label: 'Energy Production (MW)'
        }
      ]
    };
  });

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
