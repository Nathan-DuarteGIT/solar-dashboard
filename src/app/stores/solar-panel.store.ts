import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject} from '@angular/core';
import { ProductionData, SolarPanel } from '../interfaces/solar-panel.interface';
import { SolarPanelService } from '../services/solar-panel.service';

type SolarPanelState = {
  panels: SolarPanel[];
  productionData: ProductionData[];
  loading: boolean;
  error: string | null;
};

const initialState: SolarPanelState = {
  panels: [],
  productionData: [],
  loading: false,
  error: null,
};

export const solarPanelStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        totalProduction: computed(() => store.panels().reduce((total, p) => total + p.todayProduction, 0)),
        activePanelsCount: computed(() => store.panels().filter(p => p.status === 'Active').length),
        chartTotalToday: computed(() => store.productionData().reduce((total, p) => total + p.production, 0)),
        peakHour: computed(() => {
            const data = store.productionData();
            if (data.length === 0) return '-';
            const peak = data.reduce((max, current) => max.production > current.production ? max : current);
            return `H${peak.hour} (${peak.production} MW)`;
        }),
        chartData: computed(() => {
            const data = store.productionData();
            return {
                labels: data.map(d => `H${d.hour}`),
                datasets: [
                    {
                        data: data.map(d => d.production),
                        label: 'Energy Production (MW)',
                        backgroundColor: data.map(d => {
                            switch (d.type) {
                                case 'production': return 'rgba(39, 174, 96, 0.8)'; // Green
                                case 'limited': return 'rgba(155, 89, 182, 0.8)'; // purple
                                case 'idle': return 'rgba(52, 152, 219, 0.8)'; // Blue
                                default: return 'rgba(0, 0, 0, 0.1)'; // Default color
                            }
                        })
                    }
                ]
            };
        })
    })),
    withMethods((store, api = inject(SolarPanelService)) => ({
        async loadDasboardData() {
            patchState(store, { loading: true, error: null });
            try {
                const [panelsData, prodData] = await Promise.all([
                    api.fetchPanels(),
                    api.fetchProductionData()
                ]);

                patchState(store, { panels: panelsData, productionData: prodData, loading: false });
            } catch (error) {
                patchState(store, { error: 'Failed to load solar panels', loading: false });
            }
        },

        async addPanel(newPanelData: Omit<SolarPanel, 'id'>) {
            patchState(store, { loading: true });
            try {
                const newPanel = await api.addPanelApi(newPanelData);
                patchState(store, (state) => ({ 
                    panels: [newPanel,...state.panels], 
                    loading: false }));
            } catch (error) {
                patchState(store, { error: 'Failed to add solar panel', loading: false });
            }
        },

        async updatePanel(id: string, updatedData: Partial<SolarPanel>) {
            patchState(store, { loading: true });
            try {
                const updatedPanel = await api.updatePanelApi(id, updatedData);
                patchState(store, (state) => ({
                    panels: state.panels.map(p => p.id === id ? updatedPanel : p),
                    loading: false
                }));
            } catch (error) {
                patchState(store, { error: 'Failed to update solar panel', loading: false });
            }
        },

        async deletePanel(id: string) {
            patchState(store, { loading: true});
            try {
                await api.deletePanelApi(id);
                patchState(store, { panels: store.panels().filter(p => p.id !== id), loading: false });
            } catch (error) {
                patchState(store, { error: 'Failed to delete solar panel', loading: false });
            }
        }
    }))
);