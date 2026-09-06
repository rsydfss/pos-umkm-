import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function formatRupiah(value) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

export default function Index({
    startDate,
    endDate,
    transactions,
    totalRevenue,
    totalTransactions,
    totalItems,
    paymentSummary,
    topProducts,
}) {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const filter = (e) => {
        e.preventDefault();

        router.get(
            route('reports.index'),
            {
                start_date: start,
                end_date: end,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Laporan Penjualan
                </h2>
            }
        >
            <Head title="Laporan Penjualan" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Filter */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <form
                            onSubmit={filter}
                            className="grid gap-4 sm:grid-cols-4"
                        >
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dari
                                </label>

                                <input
                                    type="date"
                                    value={start}
                                    onChange={(e) =>
                                        setStart(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Sampai
                                </label>

                                <input
                                    type="date"
                                    value={end}
                                    onChange={(e) =>
                                        setEnd(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700"
                                >
                                    Terapkan
                                </button>
                            </div>

                            <div className="flex items-end gap-2">
                                <a
                                    href={route('reports.export.excel', {
                                        start_date: start,
                                        end_date: end,
                                    })}
                                    className="flex-1 rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700"
                                >
                                    Export Excel
                                </a>

                                <a
                                    href={route('reports.export.pdf', {
                                        start_date: start,
                                        end_date: end,
                                    })}
                                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-center font-medium text-white hover:bg-red-700"
                                >
                                    Export PDF
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Statistik */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Total Penjualan
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {formatRupiah(totalRevenue)}
                            </p>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Jumlah Transaksi
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {totalTransactions}
                            </p>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Produk Terjual
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {totalItems}
                            </p>
                        </div>
                    </div>

                    {/* Produk Terlaris */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="border-b p-6">
                            <h3 className="font-semibold">
                                Produk Terlaris
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm">
                                            Produk
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm">
                                            Terjual
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm">
                                            Penjualan
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {topProducts.map((item) => (
                                        <tr key={item.product_id}>
                                            <td className="px-6 py-4">
                                                {item.product?.name ?? '-'}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {item.total_quantity}
                                            </td>

                                            <td className="px-6 py-4 text-right font-medium">
                                                {formatRupiah(
                                                    item.total_sales
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {topProducts.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-6 text-center text-gray-500"
                                            >
                                                Belum ada data.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Metode Pembayaran */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="border-b p-6">
                            <h3 className="font-semibold">
                                Metode Pembayaran
                            </h3>
                        </div>

                        <div className="divide-y">
                            {paymentSummary.map((item) => (
                                <div
                                    key={item.payment_method}
                                    className="flex justify-between px-6 py-4"
                                >
                                    <span className="capitalize">
                                        {item.payment_method}
                                    </span>

                                    <span className="font-medium">
                                        {formatRupiah(item.total)}{' '}
                                        ({item.count} transaksi)
                                    </span>
                                </div>
                            ))}

                            {paymentSummary.length === 0 && (
                                <p className="p-6 text-gray-500">
                                    Belum ada data.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Transaksi */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="border-b p-6">
                            <h3 className="font-semibold">
                                Daftar Transaksi
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm">
                                            No
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm">
                                            Kasir
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm">
                                            Pembayaran
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4">
                                                #{transaction.id}
                                            </td>

                                            <td className="px-6 py-4">
                                                {transaction.user?.name ?? '-'}
                                            </td>

                                            <td className="px-6 py-4 capitalize">
                                                {transaction.payment_method}
                                            </td>

                                            <td className="px-6 py-4 text-right font-medium">
                                                {formatRupiah(
                                                    transaction.total
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {transactions.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-6 text-center text-gray-500"
                                            >
                                                Belum ada transaksi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}