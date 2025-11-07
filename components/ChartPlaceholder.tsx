'use client';


export default function ChartPlaceholder({ title, heightClass = 'chart-h-64' }: { title?: string; heightClass?: string }) {
    return (
        <div className={`card ${heightClass}`}>
            {title && <div className="text-gray-700 font-medium mb-3">{title}</div>}
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">[Chart placeholder]</div>
        </div>
    );
}