// components/charts/TopCategoriesChart.tsx
'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    height?: string;
};

export default function TopCategoriesChart({ height = 'h-72' }: Props) {
    const data = {
        labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
        datasets: [
            {
                label: 'Categories',
                data: [45, 22, 14, 10, 9],
                backgroundColor: [
                    '#3B82F6', // blue
                    '#6366F1', // indigo
                    '#10B981', // green
                    '#F59E0B', // amber
                    '#EF4444', // red
                ],
                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const },
            tooltip: {},
        },
        onClick: (evt: any, elements: any[]) => {
            if (elements && elements.length > 0) {
                const el = elements[0];
                const datasetIndex = el.datasetIndex;
                const index = el.index;
                const label = data.labels[index];
                // example action: navigate to product category page
                // (use router if needed — omitted here)
                console.log('Clicked pie slice:', label);
            }
        },
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-4 ${height}`}>
            <div className="text-gray-700 font-medium mb-4">Top Categories</div>
            <div className="w-full h-full">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}
