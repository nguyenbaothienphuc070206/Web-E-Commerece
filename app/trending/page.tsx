// app/trending/page.tsx
import LayoutShell from '../../components/LayoutShell';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

export default function TrendingPage() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendA = [12, 18, 25, 30, 28, 34, 40];
    const searches = [150, 180, 220, 300, 250, 420, 500];

    return (
        <LayoutShell title="Trending Analysis" subtitle="Detect rising products, search and market signals">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <LineChart labels={days} datasets={[{ label: 'Interest score', data: trendA, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)' }]} title="Hot Trends (weekly)" heightClass="h-64" />
                <BarChart labels={days} dataValues={searches} label="Searches" color="#3b82f6" title="Search Volume" heightClass="h-64" />
            </div>

            <div className="mt-6">
                <LineChart labels={['Week1', 'Week2', 'Week3', 'Week4']} datasets={[{ label: 'Forecast', data: [20, 35, 45, 60], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)' }]} title="Short-term Forecast" heightClass="h-48" />
            </div>
        </LayoutShell>
    );
}
