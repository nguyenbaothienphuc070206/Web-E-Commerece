// components/charts/RevenueChart.tsx
'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Props = {
    height?: string; // tailwind h-.. class like 'h-72'
};

export default function RevenueChart({ height = 'h-72' }: Props) {
    const router = useRouter();

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Revenue',
                data: [28000, 34000, 42000, 38000, 46000, 52000],
                fill: true,
                backgroundColor: 'rgba(79,70,229,0.12)', // indigo translucent
                borderColor: 'rgba(79,70,229,1)',
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom' as const },
            title: { display: false },
            tooltip: { mode: 'index' as const, intersect: false },
        },
        interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                ticks: {
                    callback: (value: any) => {
                        // format as k for thousands
                        const v = Number(value);
                        if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                        return `$${v}`;
                    },
                },
                grid: { color: 'rgba(15,23,42,0.04)' },
            },
        },
        onClick: (evt: any, elements: any[]) => {
            // drill-down example: click a point to navigate to revenue details
            if (elements && elements.length > 0) {
                const element = elements[0];
                const idx = element.index;
                const month = labels[idx];
                // example: navigate to revenue detail page with query param
                router.push(`/revenue-analytics?month=${month}`);
            }
        },
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-4 ${height}`}>
            <div className="text-gray-700 font-medium mb-4">Revenue Trend</div>
            <div className="w-full h-full">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}