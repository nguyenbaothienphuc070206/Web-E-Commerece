'use client';


import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function BarChart({ labels, dataValues, label = 'Data', color = '#4f46e5', title = '', heightClass = 'chart-h-64' }: {
    labels: string[]; dataValues: number[]; label?: string; color?: string; title?: string; heightClass?: string;
}) {
    const data = { labels, datasets: [{ label, data: dataValues, backgroundColor: color }] };
    const options: any = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: !!title, text: title } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(15,23,42,0.04)' } } } };


    return (
        <div className={`card ${heightClass}`}>
            {title && <div className="text-gray-700 font-medium mb-3">{title}</div>}
            <div className="w-full h-full">
                <Bar data={data as any} options={options} />
            </div>
        </div>
    );
}