import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

function formatRupiah(value) {
    return 'Rp ' + Number(value ?? 0).toLocaleString('id-ID');
}

export default function Dashboard({
    todayTotal,
    monthTotal,
    salesTrend,
    topProducts,
    lowStockProducts,
}) {
    const chartData = salesTrend.map((row) => ({
        tanggal: new Date(row.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
        }),
        total: Number(row.total),
    }));

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Ringkasan aktivitas penjualan toko
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Statistik */}
                    <div className="grid gap-4 md:grid-cols-2">

                        {/* Penjualan Hari Ini */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Penjualan Hari Ini
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {formatRupiah(todayTotal)}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.657 0 3 .895 3 2m-3-2V5m0 6v2m0 0v3m0-3c-1.657 0-3-.895-3-2m3 5c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Penjualan Bulan Ini */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Penjualan Bulan Ini
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {formatRupiah(monthTotal)}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 3v18h18M7 16l4-5 3 3 5-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Tren Penjualan
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Penjualan selama 7 hari terakhir
                            </p>
                        </div>

                        {chartData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: 10,
                                            bottom: 10,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="tanggal"
                                            tick={{ fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            tickFormatter={(value) =>
                                                `${value / 1000}k`
                                            }
                                            tick={{ fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            formatter={(value) => [
                                                formatRupiah(value),
                                                'Penjualan',
                                            ]}
                                            contentStyle={{
                                                borderRadius: '10px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow:
                                                    '0 4px 12px rgba(0,0,0,0.08)',
                                            }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#4f46e5"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-50">
                                <div className="text-center">
                                    <p className="font-medium text-gray-600">
                                        Belum ada data transaksi
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Grafik akan muncul setelah ada transaksi.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Produk + Stok */}
                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* Produk Terlaris */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="border-b border-gray-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Produk Terlaris
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Produk dengan penjualan terbanyak
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {topProducts.map((item, index) => (
                                    <div
                                        key={item.product_id}
                                        className="flex items-center justify-between px-6 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                                {index + 1}
                                            </div>

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product?.name ?? '-'}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Produk terlaris
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                            {item.total_terjual} terjual
                                        </span>
                                    </div>
                                ))}

                                {topProducts.length === 0 && (
                                    <div className="px-6 py-10 text-center">
                                        <p className="font-medium text-gray-500">
                                            Belum ada data penjualan
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            Produk terlaris akan muncul di sini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stok Menipis */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="border-b border-gray-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Stok Menipis
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Produk yang perlu segera diperhatikan
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between px-6 py-4"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {product.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                SKU: {product.sku}
                                            </p>
                                        </div>

                                        <span
                                            className={
                                                product.stock === 0
                                                    ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700'
                                                    : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
                                            }
                                        >
                                            {product.stock === 0
                                                ? 'Habis'
                                                : `${product.stock} tersisa`}
                                        </span>
                                    </div>
                                ))}

                                {lowStockProducts.length === 0 && (
                                    <div className="px-6 py-10 text-center">
                                        <p className="font-medium text-emerald-600">
                                            Semua stok aman
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            Tidak ada produk dengan stok menipis.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}