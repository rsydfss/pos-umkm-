import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function formatRupiah(value) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

export default function Dashboard({ todayTotal, monthTotal, salesTrend, topProducts, lowStockProducts }) {
    const chartData = salesTrend.map(row => ({
        tanggal: new Date(row.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        total: Number(row.total),
    }));

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="py-8 max-w-6xl mx-auto sm:px-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-sm text-gray-500">Penjualan Hari Ini</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatRupiah(todayTotal)}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-sm text-gray-500">Penjualan Bulan Ini</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatRupiah(monthTotal)}</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <p className="font-medium mb-4">Tren Penjualan (7 Hari Terakhir)</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="tanggal" />
                            <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                            <Tooltip formatter={(value) => formatRupiah(value)} />
                            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    {chartData.length === 0 && (
                        <p className="text-gray-500 text-sm text-center">Belum ada data transaksi.</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="font-medium mb-3">Produk Terlaris</p>
                        <ul className="divide-y">
                            {topProducts.map(item => (
                                <li key={item.product_id} className="py-2 flex justify-between text-sm">
                                    <span>{item.product?.name}</span>
                                    <span className="text-gray-500">{item.total_terjual} terjual</span>
                                </li>
                            ))}
                            {topProducts.length === 0 && <p className="text-gray-500 text-sm">Belum ada data.</p>}
                        </ul>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="font-medium mb-3">⚠️ Stok Menipis</p>
                        <ul className="divide-y">
                            {lowStockProducts.map(product => (
                                <li key={product.id} className="py-2 flex justify-between text-sm">
                                    <span>{product.name}</span>
                                    <span className="text-red-600 font-medium">{product.stock} tersisa</span>
                                </li>
                            ))}
                            {lowStockProducts.length === 0 && <p className="text-gray-500 text-sm">Semua stok aman.</p>}
                        </ul>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}