// app/budget-planner/page.tsx
import LayoutShell from '../../components/LayoutShell';
import LineChart from '../../components/charts/LineChart';

export default function BudgetPlannerPage() {
    return (
        <LayoutShell title="Budget Planner" subtitle="Plan and track budgets for campaigns and inventory">
            <div className="mt-4 flex gap-3">
                <button className="bg-indigo-600 text-white rounded px-3 py-2">New Budget</button>
                <button className="border rounded px-3 py-2">Import</button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
                <LineChart labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} datasets={[
                    { label: 'Budget', data: [5000, 5000, 6000, 6000, 7000, 7000], borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.08)' },
                    { label: 'Actual', data: [4800, 5100, 5800, 6200, 6900, 7100], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)' },
                ]} title="Monthly Budget vs Actual" heightClass="h-72" />
            </div>
        </LayoutShell>
    );
}
