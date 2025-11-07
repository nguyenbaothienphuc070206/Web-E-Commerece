// app/revenue-analytics/page.tsx
import LayoutShell from '../../components/LayoutShell';
import ChartPlaceholder from '../../components/ChartPlaceholder';

export default function RevenueAnalyticsPage() {
    return (
        <LayoutShell title="Revenue Analytics" subtitle="Deep dive into revenue, channels and cohorts">
            <div className="flex gap-3 items-center mt-4">
                {/* quick filters */}
                <select className="rounded-md border px-3 py-2"><option>Last 30 days</option></select>
                <select className="rounded-md border px-3 py-2"><option>All regions</option></select>
                <button className="ml-auto bg-indigo-600 text-white rounded px-3 py-2">Export CSV</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-6">
                <div className="lg:col-span-2">
                    <ChartPlaceholder title="Revenue (Gross vs Net)" height="h-80" />
                </div>
                <div>
                    <ChartPlaceholder title="Revenue by Channel" height="h-80" />
                </div>
            </div>

            <div className="mt-6">
                <ChartPlaceholder title="Cohort / Retention (placeholder)" height="h-64" />
            </div>
        </LayoutShell>
    );
}
