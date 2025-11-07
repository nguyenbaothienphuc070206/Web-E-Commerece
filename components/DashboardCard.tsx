'use client';

import { JSX } from "react";
import { FaArrowUp, FaArrowDown, FaDollarSign, FaUser, FaBox, FaChartLine } from "react-icons/fa";

type Props = {
    title: string;
    value: string | number;
    meta?: string;
    iconType?: "money" | "user" | "box" | "trend";
};

export default function DashboardCard({ title, value, meta, iconType = 'trend' }: Props) {
    const icons: Record<string, JSX.Element> = {
        money: <FaDollarSign />, user: <FaUser />, box: <FaBox />, trend: <FaChartLine />,
    };


    const isNegative = meta?.includes('-');


    return (
        <div className="card flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg">{icons[iconType]}</div>
            <div className="flex-1">
                <div className="text-sm text-muted">{title}</div>
                <div className="text-xl font-semibold mt-1">{value}</div>
                {meta && (
                    <div className={`text-xs mt-1 flex items-center gap-1 ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
                        {isNegative ? <FaArrowDown /> : <FaArrowUp />}
                        {meta}
                    </div>
                )}
            </div>
        </div>
    );
}