import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductionData } from '../interfaces/solar-panel.interface';
import { SolarPanel } from '../interfaces/solar-panel.interface';

@Service()
export class SolarPanelService {
    private http = inject(HttpClient);

    panels = signal<SolarPanel[]>([]); // Array of solar panels
    productionData = signal<ProductionData[]>([]); // Hourly production
    loading = signal<boolean>(false); // Loading indicator
    error = signal<string | null>(null); // Error messages

    getTotalProduction = computed(() => this.panels().reduce((total, panel) => total + panel.todayProduction, 0));
    getActivePanelsCount = computed(() => this.panels().filter(panel =>panel.status === 'Active').length);

    async loadPanels(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const response = await firstValueFrom(this.http.get<{success: boolean, data: SolarPanel[]}>('http://localhost:3000/api/panels'));
            this.panels.set(response.data);
            console.log('Solar panels loaded:', response.data.length);

        }catch (err) {
            this.error.set('Failed to load solar panels');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }
    async loadProductionData(): Promise<void>{
        this.loading.set(true);
        this.error.set(null);
        try {
            const response = await firstValueFrom(this.http.get<{success: boolean, data: ProductionData[]}>('http://localhost:3000/api/production'));
            this.productionData.set(response.data);
            console.log('Production data loaded:', response.data.length);
        } catch (err) {
            this.error.set('Failed to load production data');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    async addPanel(newPanel: Omit<SolarPanel, 'id'>): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const savedPanel = await firstValueFrom(this.http.post<SolarPanel>('http://localhost:3000/api/panels', newPanel));

            //add the new panel to the signal
            this.panels.update(panels => [...panels, savedPanel]);
            console.log('New solar panel added.', savedPanel);
        } catch (err) {
            this.error.set('Failed to add new solar panel');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    async updatePanel(id: string, updatedData: Partial<SolarPanel>): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try{
            const updatedPanel = await firstValueFrom(this.http.put<SolarPanel>(`http://localhost:3000/api/panels/${id}`, updatedData));

            // Update the panel in the signal
            this.panels.update(currentPanels =>
                currentPanels.map(panel => panel.id === id ? updatedPanel : panel)
            );
        } catch (err) {
            this.error.set('Failed to update solar panel');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    async deletePanel(id: string): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            await firstValueFrom(this.http.delete(`http://localhost:3000/api/panels/${id}`));
            
            // Remove the panel from the signal
            this.panels.update(currentPanels => currentPanels.filter(panel => panel.id !== id));
            console.log('Solar panel deleted:', id);
        } catch (err) {
            this.error.set('Failed to delete solar panel');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }
}
