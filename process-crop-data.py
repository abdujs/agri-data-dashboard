# process-crop-data.py - UPDATED WITH DIVERSIFIED COUNTRIES
import pandas as pd
import numpy as np
import json
from datetime import datetime

print("🚀 Processing agriculture data...")

# Load your CSV
df = pd.read_csv('yield_df.csv')
print(f"📊 Loaded {len(df):,} rows from CSV")
print(f"🌍 Total countries in data: {df['Area'].nunique()}")

# Clean column names for JavaScript
df.columns = df.columns.str.replace('/', '_')
df.columns = df.columns.str.replace(' ', '_')

# Select DIVERSE countries for better dashboard
# Prioritize countries from different regions
target_countries = [
    'Ethiopia', 'India', 'United States', 'China', 'Brazil',  # Major economies
    'Nigeria', 'Egypt', 'Kenya',  # Africa
    'France', 'Germany', 'United Kingdom',  # Europe
    'Australia', 'Indonesia', 'Pakistan', 'Bangladesh',  # Asia-Pacific
    'Mexico', 'Argentina'  # Latin America
]

# Filter to include target countries
df_filtered = df[df['Area'].isin(target_countries)]

if len(df_filtered) == 0:
    print("⚠️  Target countries not found in data. Using sample data...")
    df_filtered = create_diverse_sample_data()
else:
    print(f"✅ Found {len(df_filtered):,} rows for {len(target_countries)} target countries")

# If still too small, add more data
if len(df_filtered) < 3000:
    additional = df[~df['Area'].isin(target_countries)].sample(
        min(3000 - len(df_filtered), len(df)),
        random_state=42
    )
    df_filtered = pd.concat([df_filtered, additional])

print(f"📈 Final dataset: {len(df_filtered):,} rows from {df_filtered['Area'].nunique()} countries")

# Export main dataset
df_filtered.to_json('src/data/cropData.json', orient='records', indent=2)

# Create PRE-FORMATTED chart data
print("\n📊 Creating pre-formatted chart data...")


# 1. Get all countries in filtered data
all_countries = df_filtered['Area'].unique().tolist()
print(f"   Including all countries in lineChart: {', '.join(all_countries[:8])}... (total {len(all_countries)})")

line_chart_data = {}
colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#8b5cf6', '#10b981', '#f97316']

for i, country in enumerate(all_countries):
    country_data = df_filtered[df_filtered['Area'] == country]
    yearly_avg = country_data.groupby('Year')['hg_ha_yield'].mean().round(2)
    line_chart_data[country] = {
        'labels': yearly_avg.index.astype(str).tolist(),
        'datasets': [{
            'label': f'Yield in {country}',
            'data': yearly_avg.values.tolist(),
            'borderColor': colors[i % len(colors)],
            'backgroundColor': f'{colors[i % len(colors)]}20',
            'borderWidth': 3,
            'fill': True,
            'tension': 0.3
        }]
    }

# 2. PIE CHART DATA: Crop distribution
crop_counts = df_filtered['Item'].value_counts().head(8)
pie_chart_data = {
    'labels': crop_counts.index.tolist(),
    'datasets': [{
        'data': crop_counts.values.tolist(),
        'backgroundColor': colors,
        'borderWidth': 2,
        'hoverOffset': 15
    }]
}

# 3. BAR CHART DATA: Top countries by average yield
top_yield = df_filtered.groupby('Area')['hg_ha_yield'].mean().nlargest(10).round(2)
bar_chart_data = {
    'labels': top_yield.index.tolist(),
    'datasets': [{
        'label': 'Average Yield (hg/ha)',
        'data': top_yield.values.tolist(),
        'backgroundColor': '#0ea5e9',
        'borderColor': '#075985',
        'borderWidth': 1,
        'borderRadius': 6
    }]
}

# 4. DUAL-AXIS DATA: Yield vs Temperature for all countries
dual_axis_data = {}
for country in all_countries:
    country_data = df_filtered[df_filtered['Area'] == country]
    yearly_stats = country_data.groupby('Year').agg({
        'hg_ha_yield': 'mean',
        'avg_temp': 'mean'
    }).round(2)
    dual_axis_data[country] = {
        'labels': yearly_stats.index.astype(str).tolist(),
        'yield': yearly_stats['hg_ha_yield'].tolist(),
        'temperature': yearly_stats['avg_temp'].tolist()
    }

# 5. METADATA
metadata = {
    'totalRecords': int(len(df_filtered)),
    'countriesCount': int(df_filtered['Area'].nunique()),
    'cropsCount': int(df_filtered['Item'].nunique()),
    'yearsRange': [int(df_filtered['Year'].min()), int(df_filtered['Year'].max())],
    'averages': {
        'yield': float(df_filtered['hg_ha_yield'].mean().round(2)),
        'rainfall': float(df_filtered['average_rain_fall_mm_per_year'].mean().round(2)),
        'temperature': float(df_filtered['avg_temp'].mean().round(2))
    },
    'topCountries': all_countries[:8],
    'availableCountries': all_countries,
    'lastUpdated': datetime.now().isoformat(),
    'dataSource': 'FAO/World Bank Agricultural Data'
}

# Save all files
with open('src/data/chartData.json', 'w') as f:
    json.dump({
        'lineChart': line_chart_data,
        'pieChart': pie_chart_data,
        'barChart': bar_chart_data,
        'dualAxis': dual_axis_data,
        'availableCountries': all_countries
    }, f, indent=2)

with open('src/data/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

# Create summary file
summary = {
    'countries': df_filtered['Area'].unique().tolist(),
    'crops': df_filtered['Item'].unique().tolist()[:20],
    'years': f"{df_filtered['Year'].min()} - {df_filtered['Year'].max()}",
    'sampleSize': len(df_filtered)
}

with open('src/data/summary.json', 'w') as f:
    json.dump(summary, f, indent=2)

print(f"""
✅ Processing complete!
   
📁 Files created:
    • cropData.json: {len(df_filtered):,} records
    • chartData.json: Pre-formatted charts
    • metadata.json: Dashboard statistics
    • summary.json: Data overview

🌍 Available countries: {', '.join(all_countries[:5])}...
🌾 Available crops: {df_filtered['Item'].nunique()} types
📅 Years: {df_filtered['Year'].min()} - {df_filtered['Year'].max()}

🚀 Run your dashboard: npm run dev
""")

def create_diverse_sample_data():
    """Create diverse sample data if CSV lacks target countries"""
    print("   Generating diverse sample data...")
    
    countries = ['Ethiopia', 'India', 'United States', 'Brazil', 'China', 
                'Nigeria', 'France', 'Germany', 'Australia', 'Mexico']
    crops = ['Maize', 'Wheat', 'Rice', 'Potatoes', 'Soybeans', 
            'Cassava', 'Barley', 'Sorghum', 'Millet', 'Rye']
    years = list(range(1990, 2020))
    
    data = []
    for year in years:
        for country in countries:
            for crop in crops[:6]:
                base_yields = {
                    'Maize': 30000, 'Wheat': 28000, 'Rice': 40000,
                    'Potatoes': 180000, 'Soybeans': 25000, 'Cassava': 100000
                }
                
                yield_value = base_yields.get(crop, 20000)
                yield_value = int(yield_value * (1 + 0.015 * (year - 1990)) * np.random.uniform(0.9, 1.1))
                
                data.append({
                    'Area': country,
                    'Item': crop,
                    'Year': year,
                    'hg_ha_yield': yield_value,
                    'average_rain_fall_mm_per_year': int(np.random.uniform(300, 1200)),
                    'avg_temp': round(np.random.uniform(10, 30), 1),
                    'pesticides_tonnes': int(np.random.uniform(100, 5000))
                })
    
    return pd.DataFrame(data)