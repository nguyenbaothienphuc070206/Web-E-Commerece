// app/recommendations/page.tsx
import LayoutShell from '../../components/LayoutShell';
import BarChart from '../../components/charts/BarChart';

export default function RecommendationsPage() {
    const impact = [12, 9, 7];

    return (
        <LayoutShell title="Recommendations" subtitle="Automated, actionable suggestions">
            <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="bg-white border rounded-xl p-4">
                    <div className="font-medium">Promote product ABC (reason: rising demand)</div>
                    <div className="text-sm text-gray-500 mt-2">Action: create promotion / push to homepage</div>
                </div>

                <BarChart labels={['Promote', 'Reorder', 'Email']} dataValues={impact} title="Estimated Impact Score" color="#10b981" heightClass="h-48" />
            </div>
        </LayoutShell>
    );
}
