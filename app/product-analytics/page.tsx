// app/product-analytics/page.tsx
import LayoutShell from '../../components/LayoutShell';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';

export default function ProductAnalyticsPage() {
    const productNames = ['iPhone 15', 'MacBook Pro', 'AirPods', 'Galaxy S', 'Laptop X'];
    const productSales = [2156, 1247, 980, 860, 720];

    return (
        <LayoutShell title="Product Analytics" subtitle="Track product performance, inventory and funnels">
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <BarChart labels={productNames} dataValues={productSales} title="Top Products by Sales" heightClass="h-80" />
                </div>

                <div>
                    <DoughnutChart labels={['In Stock', 'Low Stock', 'Out of Stock']} values={[60, 30, 10]} title="Inventory Health" heightClass="h-80" />
                </div>
            </div>

            <div className="mt-6">
                <div className="bg-white border rounded-xl p-4">
                    <div className="font-medium text-gray-700 mb-2">Top Products (placeholder)</div>
                    <div className="text-sm text-gray-500">Table view here — columns: Product, Sales, Revenue, Margin, Stock</div>
                </div>
            </div>
        </LayoutShell>
    );
}
