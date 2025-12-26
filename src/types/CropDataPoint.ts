// CropDataPoint.ts
// TypeScript interface for a single crop data record

export interface CropDataPoint {
  Area: string; // Country
  Item: string; // Crop type
  Year: number;
  hg_ha_yield: number;
  average_rain_fall_mm_per_year: number;
  pesticides_tonnes: number;
  avg_temp: number;
}

// Filter types for dashboard controls
export interface CropDataFilters {
  country: string;
  crops: string[];
  yearRange: [number, number];
}
