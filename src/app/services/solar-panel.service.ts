import { computed, Service, signal } from '@angular/core';
import { ProductionData } from '../interfaces/solar-panel.interface';
import { SolarPanel } from '../interfaces/solar-panel.interface';

@Service()
export class SolarPanelService {
    panels = signal<SolarPanel[]>([]); // Array of solar panels
    productionData = signal<ProductionData[]>([]); // Hourly production
    loading = signal<boolean>(false); // Loading indicator
    error = signal<string | null>(null); // Error messages

    getTotalProduction = computed(() => this.panels().reduce((total, panel) => total + panel.todayProduction, 0));
    getActivePanelsCount = computed(() => this.panels().filter(panel =>panel.status === 'Active').length);

    loadPanels(): void {}
    loadProductionData(): void {}
}
