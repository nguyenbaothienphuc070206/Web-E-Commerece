"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, Plus, Truck, PackageCheck, MapPin, MoreHorizontal, Navigation, Calendar, Box, ChevronLeft, ChevronRight, Filter, X, ChevronRight as ChevronRightIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Shipment {
    id: string
    orderId: string
    carrier: string
    trackingNumber: string
    status: 'In-Transit' | 'Delivered' | 'Pending' | 'At Warehouse'
    destination: string
    progress: number
    startDate: string
    estimatedDate: string
    category: string
    quantity: number
}

export default function ShipmentTracking() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState({ start: "", end: "" })
    const menuRef = useRef<HTMLDivElement>(null)

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const categories = ["Laptop", "iPad", "iPhone", "Watch"]
    const statuses = ["In-Transit", "Delivered", "Pending", "At Warehouse"]
    const suppliers = ["DHL Express", "FedEx", "UPS"]
    const quickTimelines = ["Today", "Last Week", "Last Month", "Last Year"]

    // sample dataset
    const [shipments] = useState<Shipment[]>([
        { id: "SHP-001", orderId: "ORD-101", carrier: "DHL Express", trackingNumber: "DHL-101-AAA", status: "Delivered", destination: "New York, US", progress: 100, startDate: "2025-01-10", estimatedDate: "2025-01-15", category: "Laptop", quantity: 5 },
        { id: "SHP-002", orderId: "ORD-102", carrier: "FedEx", trackingNumber: "FDX-102-BBB", status: "Delivered", destination: "London, UK", progress: 100, startDate: "2025-02-14", estimatedDate: "2025-02-20", category: "iPad", quantity: 10 },
        { id: "SHP-003", orderId: "ORD-103", carrier: "UPS", trackingNumber: "UPS-103-CCC", status: "Delivered", destination: "Tokyo, JP", progress: 100, startDate: "2025-03-05", estimatedDate: "2025-03-12", category: "iPhone", quantity: 15 },
        { id: "SHP-004", orderId: "ORD-104", carrier: "DHL Express", trackingNumber: "DHL-104-DDD", status: "Delivered", destination: "Singapore, SG", progress: 100, startDate: "2025-04-20", estimatedDate: "2025-04-25", category: "Watch", quantity: 8 },
        { id: "SHP-005", orderId: "ORD-105", carrier: "FedEx", trackingNumber: "FDX-105-EEE", status: "Delivered", destination: "Paris, FR", progress: 100, startDate: "2025-05-12", estimatedDate: "2025-05-18", category: "Laptop", quantity: 3 },
        { id: "SHP-006", orderId: "ORD-106", carrier: "UPS", trackingNumber: "UPS-106-FFF", status: "Delivered", destination: "Berlin, DE", progress: 100, startDate: "2025-06-01", estimatedDate: "2025-06-07", category: "iPad", quantity: 20 },
        { id: "SHP-007", orderId: "ORD-107", carrier: "DHL Express", trackingNumber: "DHL-107-GGG", status: "Delivered", destination: "Sydney, AU", progress: 100, startDate: "2025-07-15", estimatedDate: "2025-07-22", category: "iPhone", quantity: 12 },
        { id: "SHP-008", orderId: "ORD-108", carrier: "FedEx", trackingNumber: "FDX-108-HHH", status: "Delivered", destination: "Toronto, CA", progress: 100, startDate: "2025-08-22", estimatedDate: "2025-08-28", category: "Watch", quantity: 25 },
        { id: "SHP-009", orderId: "ORD-109", carrier: "UPS", trackingNumber: "UPS-109-III", status: "Delivered", destination: "Seoul, KR", progress: 100, startDate: "2025-09-10", estimatedDate: "2025-09-15", category: "Laptop", quantity: 7 },
        { id: "SHP-010", orderId: "ORD-110", carrier: "DHL Express", trackingNumber: "DHL-110-JJJ", status: "Delivered", destination: "Dubai, AE", progress: 100, startDate: "2025-10-05", estimatedDate: "2025-10-12", category: "iPad", quantity: 30 },
        { id: "SHP-011", orderId: "ORD-111", carrier: "FedEx", trackingNumber: "FDX-111-KKK", status: "In-Transit", destination: "Mumbai, IN", progress: 45, startDate: "2025-11-20", estimatedDate: "2025-11-28", category: "iPhone", quantity: 18 },
        { id: "SHP-012", orderId: "ORD-112", carrier: "UPS", trackingNumber: "UPS-112-LLL", status: "In-Transit", destination: "Bangkok, TH", progress: 60, startDate: "2025-12-05", estimatedDate: "2025-12-12", category: "Watch", quantity: 22 },
        { id: "SHP-013", orderId: "ORD-113", carrier: "DHL Express", trackingNumber: "DHL-113-MMM", status: "In-Transit", destination: "Hong Kong, HK", progress: 30, startDate: "2025-12-28", estimatedDate: "2026-01-05", category: "Laptop", quantity: 9 },
        { id: "SHP-014", orderId: "ORD-114", carrier: "FedEx", trackingNumber: "FDX-114-NNN", status: "In-Transit", destination: "Madrid, ES", progress: 75, startDate: "2026-01-02", estimatedDate: "2026-01-08", category: "iPad", quantity: 14 },
        { id: "SHP-015", orderId: "ORD-115", carrier: "UPS", trackingNumber: "UPS-115-OOO", status: "In-Transit", destination: "Rome, IT", progress: 50, startDate: "2026-01-10", estimatedDate: "2026-01-16", category: "iPhone", quantity: 11 },
        { id: "SHP-016", orderId: "ORD-116", carrier: "DHL Express", trackingNumber: "DHL-116-PPP", status: "At Warehouse", destination: "Amsterdam, NL", progress: 15, startDate: "2026-01-18", estimatedDate: "2026-01-25", category: "Watch", quantity: 6 },
        { id: "SHP-017", orderId: "ORD-117", carrier: "FedEx", trackingNumber: "FDX-117-QQQ", status: "At Warehouse", destination: "Mexico City, MX", progress: 10, startDate: "2026-01-20", estimatedDate: "2026-01-28", category: "Laptop", quantity: 4 },
        { id: "SHP-018", orderId: "ORD-118", carrier: "UPS", trackingNumber: "UPS-118-RRR", status: "Pending", destination: "Sao Paulo, BR", progress: 0, startDate: "2026-01-22", estimatedDate: "2026-02-01", category: "iPad", quantity: 13 },
        { id: "SHP-019", orderId: "ORD-119", carrier: "DHL Express", trackingNumber: "DHL-119-SSS", status: "Pending", destination: "Cairo, EG", progress: 0, startDate: "2026-01-24", estimatedDate: "2026-02-02", category: "iPhone", quantity: 19 },
        { id: "SHP-020", orderId: "ORD-120", carrier: "FedEx", trackingNumber: "FDX-120-TTT", status: "Pending", destination: "Cape Town, ZA", progress: 0, startDate: "2026-01-26", estimatedDate: "2026-02-05", category: "Watch", quantity: 21 }
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false)
                setHoveredMenu(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev => {
            const isNewFilterTimeline = quickTimelines.includes(filter);

            if (isNewFilterTimeline) {
                const filtersWithoutTime = prev.filter(f => !quickTimelines.includes(f) && !f.includes(" → "));
                return prev.includes(filter) ? filtersWithoutTime : [...filtersWithoutTime, filter];
            }

            return prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter];
        });
        setCurrentPage(1);
    };

    const applyCustomDate = () => {
        if (dateRange.start && dateRange.end) {
            const rangeLabel = `${dateRange.start} → ${dateRange.end}`;

            setActiveFilters(prev => {
                const filtersWithoutTime = prev.filter(f => !quickTimelines.includes(f) && !f.includes(" → "));
                return [...filtersWithoutTime, rangeLabel];
            });

            setShowFilterMenu(false);
            setHoveredMenu(null);
            setCurrentPage(1);
        }
    };

    const clearAllFilters = () => {
        setActiveFilters([])
        setSearchQuery("")
        setDateRange({ start: "", end: "" })
        setCurrentPage(1)
    }

    const filteredShipments = shipments.filter((s) => {
        const matchesSearch =
            s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase());

        const otherFilters = activeFilters.filter(f => !f.includes(" → ") && !quickTimelines.includes(f));
        const matchesFilters = otherFilters.length === 0 ||
            otherFilters.includes(s.category) ||
            otherFilters.includes(s.status) ||
            otherFilters.some(f => s.carrier.includes(f));

        let matchesDate = true;
        const rangeTag = activeFilters.find(f => f.includes(" → "));

        if (rangeTag) {
            const [start, end] = rangeTag.split(" → ");
            if (s.startDate < start || s.startDate > end) {
                matchesDate = false;
            }
        }

        const quickDateTag = activeFilters.find(f => quickTimelines.includes(f));
        if (quickDateTag) {
            const today = new Date();
            const shipDate = new Date(s.startDate);
            const diffTime = today.getTime() - shipDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (quickDateTag === "Today" && shipDate.toDateString() !== today.toDateString()) matchesDate = false;
            if (quickDateTag === "Last Week" && (diffDays > 7 || diffDays < 0)) matchesDate = false;
            if (quickDateTag === "Last Month" && (diffDays > 30 || diffDays < 0)) matchesDate = false;
            if (quickDateTag === "Last Year" && (diffDays > 365 || diffDays < 0)) matchesDate = false;
        }

        return matchesSearch && matchesFilters && matchesDate;
    });

    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
    const paginatedShipments = filteredShipments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="space-y-6 font-sans antialiased text-slate-900 p-4 max-w-[1600px] mt-16">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Shipments</h2>
                    <p className="text-slate-500 text-sm">Real-time monitoring of global outbound logistics</p>
                </div>
                <Button className="flex items-center gap-2 px-6 shadow-md hover:shadow-lg transition-all bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" /> Create Shipment
                </Button>
            </div>

            {/* Toolbar Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm overflow-visible">
                <div className="flex items-center gap-2 flex-wrap relative" ref={menuRef}>
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-2 transition-all border-slate-200 ${showFilterMenu ? 'bg-slate-50 border-indigo-600 ring-2 ring-indigo-600/10' : ''}`}
                        >
                            <Filter className="h-4 w-4" /> Filter
                        </Button>

                        {/* Filter Menu */}
                        {showFilterMenu && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-visible ring-1 ring-black/5">
                                {[
                                    { label: "Supplier", items: suppliers },
                                    { label: "Category", items: categories },
                                    { label: "Status", items: statuses },
                                    { label: "Timeline", isTimeline: true }
                                ].map((group) => (
                                    <div
                                        key={group.label}
                                        onMouseEnter={() => setHoveredMenu(group.label)}
                                        className="relative flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-default text-xs font-semibold text-slate-700 transition-colors"
                                    >
                                        {group.label}
                                        <ChevronRightIcon size={12} className="text-slate-400" />

                                        {/* Sub-menu (Hover) */}
                                        {hoveredMenu === group.label && (
                                            <div className="absolute left-[calc(100%-4px)] top-0 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl py-3 z-60 animate-in slide-in-from-left-2 fade-in duration-200 ring-1 ring-black/5">
                                                {group.isTimeline ? (
                                                    <div className="px-4 space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-2 tracking-wider">Quick Select</p>
                                                            {quickTimelines.map(t => (
                                                                <div
                                                                    key={t}
                                                                    onClick={() => { toggleFilter(t); setShowFilterMenu(false); }}
                                                                    className={`py-2 px-2.5 rounded-lg cursor-pointer text-[11px] transition-colors ${activeFilters.includes(t) ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-50'}`}
                                                                >
                                                                    {t}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="h-px bg-slate-100 w-full" />
                                                        <div className="space-y-3">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Custom Range</p>
                                                            <div className="grid gap-2">
                                                                <input
                                                                    type="date"
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                                                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                                />
                                                                <input
                                                                    type="date"
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                                                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                                />
                                                                <Button size="sm" className="h-9 text-[10px] w-full font-bold bg-indigo-600 hover:bg-indigo-700" onClick={applyCustomDate}>
                                                                    Apply Range
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    group.items?.map(item => (
                                                        <div
                                                            key={item}
                                                            onClick={() => { toggleFilter(item); setShowFilterMenu(false); }}
                                                            className={`px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] cursor-pointer transition-colors ${activeFilters.includes(item) ? 'text-indigo-600 font-bold bg-indigo-50' : ''}`}
                                                        >
                                                            {item}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Filter Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {activeFilters.map(filter => (
                            <Button
                                key={filter}
                                variant="secondary"
                                size="sm"
                                className="h-8 gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 transition-all animate-in zoom-in-95 duration-200"
                                onClick={() => toggleFilter(filter)}
                            >
                                {filter} <X className="h-3 w-3" />
                            </Button>
                        ))}

                        {(activeFilters.length > 0 || searchQuery !== "") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="h-8 px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1.5 rounded-full transition-all"
                            >
                                <Trash2 size={12} />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tracking numbers, orders..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-0.1em text-slate-500 font-bold">
                            <tr>
                                <th className="text-left p-5">Tracking Details</th>
                                <th className="text-left p-5">Asset / Quantity</th>
                                <th className="text-left p-5">Schedule</th>
                                <th className="text-left p-5">Logistics Progress</th>
                                <th className="text-left p-5">Live Status</th>
                                <th className="text-right p-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedShipments.length > 0 ? (
                                paginatedShipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-slate-50/50 transition-colors text-sm group">
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-indigo-600 flex items-center gap-2 tracking-tight group-hover:translate-x-1 transition-transform">
                                                    <Navigation size={12} /> {shipment.trackingNumber}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">Order: {shipment.orderId}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{shipment.carrier}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-2">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold w-fit uppercase border border-indigo-100">{shipment.category}</span>
                                                <span className="font-bold flex items-center gap-1.5 text-[11px] text-slate-600"><Box size={14} className="text-slate-400" /> {shipment.quantity} units</span>
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold text-[11px]">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-blue-600/80"><Calendar size={13} /><span>Depart: {shipment.startDate}</span></div>
                                                <div className="flex items-center gap-2 text-amber-600/80"><Calendar size={13} /><span>Expect: {shipment.estimatedDate}</span></div>
                                            </div>
                                        </td>
                                        <td className="p-5 w-1/5">
                                            <div className="space-y-2.5">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> {shipment.destination}</span>
                                                    <span>{shipment.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200/50">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${shipment.status === 'Delivered' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`}
                                                        style={{ width: `${shipment.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${shipment.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                shipment.status === 'In-Transit' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                    shipment.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                }`}>
                                                {shipment.status === 'Delivered' ? <PackageCheck size={12} /> : <Truck size={12} className={shipment.status === 'In-Transit' ? 'animate-bounce' : ''} />}
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Search size={40} className="opacity-20" />
                                            </div>
                                            <p className="font-bold text-sm uppercase tracking-widest text-slate-500">No results match your criteria</p>
                                            <Button variant="link" onClick={clearAllFilters} className="text-indigo-600 text-xs font-bold">Clear all filters</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="flex items-center justify-between p-6 bg-slate-50/50 border-t border-slate-200">
                    {/* LEFT SIDE: Items per page & Page info */}
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages || 1}
                        </div>

                        {/* Vertical Separator */}
                        <div className="h-4 w-px bg-slate-200" />

                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setItemsPerPage(val || 1);
                                    setCurrentPage(1);
                                }}
                                className="w-12 h-7 bg-white border border-slate-200 rounded px-1.5 text-[11px] font-bold text-indigo-600 text-center outline-none focus:ring-1 focus:ring-indigo-600/30 transition-all"
                            />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</span>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Navigation Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 text-xs font-bold border-slate-200 bg-white"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} className="mr-2" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 text-xs font-bold border-slate-200 bg-white"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Next <ChevronRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}