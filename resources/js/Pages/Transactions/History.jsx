import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function History({ transactions }) {
    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString('id-ID');
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const totalRevenue = transactions.reduce(
        (sum, transaction) => sum + Number(transaction.total || 0),
        0
    );

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Riwayat Transaksi
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola dan lihat seluruh transaksi yang telah dilakukan.
                    </p>
                </div>
            }
        >
            <Head title="Riwayat Transaksi" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Statistik */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Jumlah Transaksi */}
                        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Transaksi
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-gray-800">
                                        {transactions.length}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Semua transaksi tercatat
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Pendapatan */}
                        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Penjualan
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-gray-800">
                                        Rp {formatRupiah(totalRevenue)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Total dari transaksi yang ditampilkan
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.105 0 2 .448 2 1m-2-1c-1.105 0-2 .448-2 1m2 1V5m0 14v-3m0 0c-1.105 0-2-.448-2-1m2 1c1.105 0 2-.448 2-1"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Riwayat */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">

                        {/* Header */}
                        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Daftar Transaksi
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Riwayat transaksi terbaru.
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                    {transactions.length} transaksi
                                </div>
                            </div>
                        </div>

                        {/* Empty State */}
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 14l2 2 4-4m5-5v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h8l4 4z"
                                        />
                                    </svg>
                                </div>

                                <h4 className="mt-4 text-base font-semibold text-gray-800">
                                    Belum ada transaksi
                                </h4>

                                <p className="mt-1 max-w-sm text-sm text-gray-500">
                                    Transaksi yang dilakukan melalui halaman
                                    kasir akan muncul di sini.
                                </p>

                                <Link
                                    href={route('transactions.index')}
                                    className="mt-5 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                                >
                                    Buka Kasir
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Desktop / Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">

                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Transaksi
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Tanggal
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Kasir
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Pembayaran
                                                </th>

                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Total
                                                </th>

                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {transactions.map((transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    {/* Nomor */}
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                                                #
                                                            </div>

                                                            <div className="ml-3">
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                    #{transaction.id}
                                                                </p>

                                                                <p className="text-xs text-gray-400">
                                                                    ID Transaksi
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Tanggal */}
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <p className="text-sm text-gray-700">
                                                            {formatDate(
                                                                transaction.created_at
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* Kasir */}
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                                                {(
                                                                    transaction
                                                                        .user
                                                                        ?.name ??
                                                                    'K'
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="ml-3">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {transaction
                                                                        .user
                                                                        ?.name ??
                                                                        '-'}
                                                                </p>

                                                                <p className="text-xs text-gray-400">
                                                                    Kasir
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Pembayaran */}
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                transaction.payment_method ===
                                                                'cash'
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : transaction.payment_method ===
                                                                        'qris'
                                                                      ? 'bg-purple-50 text-purple-700'
                                                                      : 'bg-blue-50 text-blue-700'
                                                            }`}
                                                        >
                                                            {transaction.payment_method
                                                                ? transaction.payment_method
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                  transaction.payment_method.slice(
                                                                      1
                                                                  )
                                                                : '-'}
                                                        </span>
                                                    </td>

                                                    {/* Total */}
                                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                                        <p className="text-sm font-bold text-gray-800">
                                                            Rp{' '}
                                                            {formatRupiah(
                                                                transaction.total
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                                        <Link
                                                            href={route(
                                                                'transactions.show',
                                                                transaction.id
                                                            )}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />

                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>

                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-gray-500">
                                            Menampilkan{' '}
                                            <span className="font-semibold text-gray-700">
                                                {transactions.length}
                                            </span>{' '}
                                            transaksi
                                        </p>

                                        <p className="text-gray-500">
                                            Total:{' '}
                                            <span className="font-bold text-gray-800">
                                                Rp {formatRupiah(totalRevenue)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}