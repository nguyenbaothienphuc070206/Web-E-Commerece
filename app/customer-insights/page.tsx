// app/customer-insights/page.tsx
import LayoutShell from '../../components/LayoutShell';
import DoughnutChart from '../../components/charts/DoughnutChart';
import LineChart from '../../components/charts/LineChart';

export default function CustomerInsightsPage() {
    return (
        <LayoutShell title="Customer Insights" subtitle="Segmentation, retention and CLV">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <DoughnutChart labels={['New', 'Returning']} values={[35, 65]} title="New vs Returning" heightClass="h-44" />
                <DoughnutChart labels={['High', 'Medium', 'Low']} values={[20, 50, 30]} title="RFM Segments" heightClass="h-44" />
                <LineChart labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']} datasets={[{ label: 'AOV', data: [45, 50, 48, 55, 60], borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.08)' }]} title="Avg Order Value trend" heightClass="h-44" />
            </div>

            <div className="mt-6">
                <div className="bg-white border rounded-xl p-4">
                    <div className="font-medium text-gray-700">High-value customers (sample)</div>
                    <div className="text-sm text-gray-500 mt-2">List & quick actions (export, email)</div>
                </div>
            </div>
        </LayoutShell>
    );
}
