// src/components/charts/DualAxisChart.tsx
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface DualAxisChartProps {
  data: Array<{
    Year: number;
    hg_ha_yield: number;
    avg_temp: number;
  }>;
  country: string;
}

export default function DualAxisChart({ data, country }: DualAxisChartProps) {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.Year]) acc[item.Year] = { yield: [], temp: [] };
    acc[item.Year].yield.push(item.hg_ha_yield);
    acc[item.Year].temp.push(item.avg_temp);
    return acc;
  }, {} as Record<number, { yield: number[]; temp: number[] }>);

  const years = Object.keys(grouped).sort();
  const avgYield = years.map(year => 
    grouped[+year].yield.reduce((a, b) => a + b, 0) / grouped[+year].yield.length
  );
  const avgTemp = years.map(year => 
    grouped[+year].temp.reduce((a, b) => a + b, 0) / grouped[+year].temp.length
  );

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Yield (hg/ha)',
        data: avgYield,
        borderColor: '#22c55e', // Green
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.3,
      },
      {
        label: 'Temperature (°C)',
        data: avgTemp,
        borderColor: '#f97316', // Orange
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        yAxisID: 'y1',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { 
      title: { display: true, text: `${country}: Yield vs Temperature Trends` }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Yield (hg/ha)' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Temperature (°C)' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}