// app/my-dashboard/page.tsx
import LayoutShell from '../../components/LayoutShell';
import LineChart from '../../components/charts/LineChart';
import DashboardCard from '../../components/DashboardCard';

export default function MyDashboardPage() {
    return (
        <LayoutShell title="My Dashboard" subtitle="Personalized view for your role">
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard title="Your Sales" value="$5,432" meta="+8% vs last period" />
                <DashboardCard title="Assigned Tasks" value="12" />
                <DashboardCard title="Open Tickets" value="3" />
                <DashboardCard title="Pending Approvals" value="2" />
            </div>

            <div className="mt-6">
                <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} datasets={[{ label: 'Your sessions', data: [12, 18, 22, 30, 26], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' }]} title="Your activity (week)" heightClass="h-48" />
            </div>
        </LayoutShell>
    );
}
