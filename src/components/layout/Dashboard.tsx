// Dashboard.tsx - UPDATED SIMPLIFIED VERSION
import { useState } from 'react';
import { TrendingUp, Droplets, Thermometer, Globe, Download } from 'lucide-react';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import CountryFilter from '../filters/CountryFilter';
import metadata from '../../data/metadata.json';
import chartData from '../../data/chartData.json';

// Type safety
interface ChartData {
  lineChart: Record<string, any>;
  pieChart: any;
  barChart: any;
  availableCountries: string[];
}

export default function Dashboard() {
  const data = chartData as ChartData;
  const [selectedCountry, setSelectedCountry] = useState<string>(
    data.availableCountries[0] || 'India'
  );
  // ...existing code...

  const exportSelectedCountryCSV = () => {
    try {
      const series = (data as any).lineChart[selectedCountry];
      if (!series) {
        alert('No data available to export for ' + selectedCountry);
        return;
      }

      const labels: string[] = series.labels || [];
      const dataset = (series.datasets && series.datasets[0] && series.datasets[0].data) || [];

      const rows = ['year,value'];
      for (let i = 0; i < labels.length; i++) {
        const year = labels[i];
        const val = dataset[i] ?? '';
        rows.push(`${year},${val}`);
      }

      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedCountry.replace(/\s+/g, '_')}-yield.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // fallback
      console.error('Export failed', err);
      alert('Export failed — see console for details.');
    }
  };

  // Removed dark mode effect (unused)

  return (
    <div className="min-h-screen dashboard-root container-inner">
      {/* Header */}
      <header className="mb-12">
        <div className="dashboard-header header-row">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg md:text-2xl font-bold">Agri‑Analytics Dashboard</h1>
            </div>
          </div>

          {/* header intentionally kept minimal and icon-free for clean UX */}
        </div>

        <div className="p-6 md:p-8 mb-6 dashboard-banner">
          <div className="banner-content">
            <div className="banner-left">
              <div className="banner-tag">Visualizing</div>
              <div className="banner-number">{metadata.totalRecords.toLocaleString()}</div>
              <div className="banner-sub">agricultural data points</div>
            </div>

            <div className="banner-right">
              <div className="banner-meta">{metadata.yearsRange[0]} — {metadata.yearsRange[1]} · {metadata.dataSource}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-card--green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Yield</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(metadata.averages.yield).toLocaleString()}
                  <span className="text-sm text-gray-500 font-normal ml-2">hg/ha</span>
                </p>
              </div>
              <div className="icon-box">
                <TrendingUp />
              </div>
            </div>
          </div>
          <div className="kpi-card kpi-card--blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Rainfall</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(metadata.averages.rainfall).toLocaleString()}
                  <span className="text-sm text-gray-500 font-normal ml-2">mm/yr</span>
                </p>
              </div>
              <div className="icon-box">
                <Droplets />
              </div>
            </div>
          </div>
          <div className="kpi-card kpi-card--orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Temp</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Number(metadata.averages.temperature).toFixed(1)}
                  <span className="text-sm text-gray-500 font-normal ml-2">°C</span>
                </p>
              </div>
              <div className="icon-box">
                <Thermometer />
              </div>
            </div>
          </div>
          <div className="kpi-card kpi-card--purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 font-bold">Countries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metadata.countriesCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">countries in dataset</p>
              </div>
              <div className="icon-box">
                <Globe />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="layout-grid">
        <aside className="filters-col">
          <div className="filters-panel">
            <CountryFilter
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={data.availableCountries}
            />
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Data Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-700">Years</span>
                    <span className="font-medium">{metadata.yearsRange[0]} — {metadata.yearsRange[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Crop types</span>
                    <span className="font-medium">{metadata.cropsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Records</span>
                    <span className="font-medium">{metadata.totalRecords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Last updated</span>
                    <span className="font-medium">{new Date(metadata.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <button onClick={exportSelectedCountryCSV} className="mt-6 w-full btn-primary" title="Export selected country's time series as CSV">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
        </aside>
        <main className="content-col">
          <div className="chart-card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Yield Trends in {selectedCountry}</h3>
            <div className="h-96">
              <LineChart data={data.lineChart[selectedCountry]} title="" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Crop Distribution</h3>
              <div className="h-72">
                <PieChart data={data.pieChart} title="" />
              </div>
            </div>

            <div className="chart-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Countries by Yield</h3>
              <div className="h-72">
                <BarChart data={data.barChart} title="" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Agriculture Analytics Dashboard</span> • 
          Built for Climate Fellowship Application • 
          Data from {metadata.dataSource}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Currently showing data from {selectedCountry} • 
          Updated: {new Date(metadata.lastUpdated).toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}