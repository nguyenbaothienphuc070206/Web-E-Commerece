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


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


type Dataset = { label: string; data: number[]; borderColor?: string; backgroundColor?: string };


type Props = { labels: string[]; datasets: Dataset[]; title?: string; heightClass?: string };


export default function LineChart({ labels, datasets, title = '', heightClass = 'chart-h-72' }: Props) {
    const data = { labels, datasets: datasets.map(ds => ({ ...ds })) };


    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' }, title: { display: !!title, text: title }, tooltip: { mode: 'index', intersect: false } },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(15,23,42,0.04)' } } },
    };


    return (
        <div className={`card ${heightClass}`}>
            {title && <div className="text-gray-700 font-medium mb-4">{title}</div>}
            <div className="w-full h-full">
                <Line data={data as any} options={options} />
            </div>
        </div>
    );
}