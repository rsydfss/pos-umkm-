import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function History({ transactions }) {
    const formatRupiah = (value) => {
        return Number(value).toLocaleString('id-ID');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Riwayat Transaksi
                </h2>
            }
        >
            <Head title="Riwayat Transaksi" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="border-b border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Semua Transaksi
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Daftar transaksi yang telah dilakukan.
                            </p>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                Belum ada transaksi.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                No
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tanggal
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Kasir
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Pembayaran
                                            </th>

                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Total
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {transactions.map(
                                            (transaction, index) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        #{transaction.id}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {transaction.user?.name ??
                                                            '-'}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-700">
                                                        {
                                                            transaction.payment_method
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-800">
                                                        Rp{' '}
                                                        {formatRupiah(
                                                            transaction.total
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                                        <Link
                                                            href={route(
                                                                'transactions.show',
                                                                transaction.id
                                                            )}
                                                            className="rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}