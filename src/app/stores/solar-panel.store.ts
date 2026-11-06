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