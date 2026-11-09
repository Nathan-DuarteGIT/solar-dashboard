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
        activePanelsCount: computed(() => store.panels().filter(p => p.status === 'Active').length)
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