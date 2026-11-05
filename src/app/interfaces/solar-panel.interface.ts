export interface SolarPanel {
  id: string;
  location: string;
  capacity: number; // in kW
  todayProduction: number; // in kWh
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface ProductionData {
    hour: number; // 1-24
    production: number; // Production in that hour
    type: 'production' | 'limited' | 'idle'; // Production
}