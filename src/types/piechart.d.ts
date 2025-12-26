declare module '../components/charts/PieChart' {
  import React from 'react';
  export interface PieChartProps {
    data: number[];
    labels: string[];
    title?: string;
  }
  const PieChart: React.FC<PieChartProps>;
  export default PieChart;
}
