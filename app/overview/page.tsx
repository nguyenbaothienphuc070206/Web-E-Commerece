// app/overview/page.tsx
import LayoutShell from '../../components/LayoutShell';
import DashboardCard from '../../components/DashboardCard';
// import ChartPlaceholder from '../../components/ChartPlaceholder';
import RevenueChart from '../../components/charts/RevenueChart';
import TopCategoriesChart from '../../components/charts/TopCategoriesChart';

export default function OverviewPage() {
    return (
        <LayoutShell title="Overview Dashboard" subtitle="Monitor your business performance and analytics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <DashboardCard title="Total Revenue" value="$124,563" meta="+12.5% from last month" iconType="money" />
                <DashboardCard title="Products Sold" value="2,847" meta="+8.2% from last month" iconType="box" />
                <DashboardCard title="Active Users" value="18,492" meta="+15.3% from last month" iconType="user" />
                <DashboardCard title="Conversion Rate" value="3.42%" meta="-2.1% from last month" iconType="trend" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="lg:col-span-2">
                    <RevenueChart height="h-72" />
                </div>
                <div>
                    <div className="chart-wrapper">
                        <TopCategoriesChart height="h-72" />
                    </div>
                </div>
            </div>

            {/* Top selling products summary */}
            <div className="mt-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 font-medium mb-3">Top Selling Products</div>
                    <div className="text-sm text-gray-500">(Placeholder table — replace with real data table)</div>
                </div>
            </div>
        </LayoutShell>
    );
}
