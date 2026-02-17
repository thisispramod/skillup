import React, { useState, useMemo } from 'react';

const DataTable = ({
    columns,
    data,
    loading,
    onSearch,
    actions,
    pageSize = 10,
    emptyMessage = "No data found"
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowerTerm = searchTerm.toLowerCase();

        return data.filter(item => {
            // Helper to recursively check values
            const checkValue = (val) => {
                if (val == null) return false;
                if (typeof val === 'object') {
                    return Object.values(val).some(checkValue);
                }
                return String(val).toLowerCase().includes(lowerTerm);
            };
            return Object.values(item).some(checkValue);
        });
    }, [data, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    return (
        <div className="card-premium overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                {actions}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [...Array(pageSize)].map((_, idx) => (
                                <tr key={idx} className="animate-pulse">
                                    {columns.map((_, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors group">
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4 text-sm text-slate-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                    <span className="material-symbols-rounded text-4xl mb-2 block">folder_off</span>
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {!loading && filteredData.length > pageSize && (
                <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="font-medium text-slate-900">{filteredData.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            <span className="material-symbols-rounded">chevron_left</span>
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === idx + 1
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            <span className="material-symbols-rounded">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
