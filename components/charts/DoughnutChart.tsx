'use client';


import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


export default function DoughnutChart({ labels, values, colors, title, heightClass = 'chart-h-64' }: {
    labels: string[]; values: number[]; colors?: string[]; title?: string; heightClass?: string;
}) {
    const data = { labels, datasets: [{ data: values, backgroundColor: colors ?? ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'] }] };
    const options: any = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } };


    return (
        <div className={`card ${heightClass}`}>
            {title && <div className="text-gray-700 font-medium mb-3">{title}</div>}
            <div className="w-full h-full">
                <Doughnut data={data as any} options={options} />
            </div>
        </div>
    );
}