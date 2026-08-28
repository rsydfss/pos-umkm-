import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ transaction }) {
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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Transaksi #{transaction.id}
                    </h2>

                    <Link
                        href={route('transactions.history')}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        ← Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Informasi transaksi */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">
                            Informasi Transaksi
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <div className="text-sm text-gray-500">
                                    Nomor Transaksi
                                </div>

                                <div className="font-medium">
                                    #{transaction.id}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">
                                    Tanggal
                                </div>

                                <div className="font-medium">
                                    {formatDate(transaction.created_at)}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">
                                    Kasir
                                </div>

                                <div className="font-medium">
                                    {transaction.user?.name ?? '-'}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">
                                    Metode Pembayaran
                                </div>

                                <div className="font-medium capitalize">
                                    {transaction.payment_method}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produk */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="border-b border-gray-200 p-6">
                            <h3 className="text-lg font-semibold">
                                Produk
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Produk
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">
                                            Qty
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                            Harga
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {transaction.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {item.product?.name ?? '-'}
                                            </td>

                                            <td className="px-6 py-4 text-center text-sm">
                                                {item.quantity}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm">
                                                Rp{' '}
                                                {formatRupiah(item.price)}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm font-semibold">
                                                Rp{' '}
                                                {formatRupiah(
                                                    item.subtotal
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Ringkasan pembayaran */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="ml-auto max-w-sm space-y-3">
                                <div className="flex justify-between">
                                    <span>Total</span>

                                    <span className="font-bold">
                                        Rp{' '}
                                        {formatRupiah(
                                            transaction.total
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Dibayar</span>

                                    <span>
                                        Rp{' '}
                                        {formatRupiah(
                                            transaction.paid_amount
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-3">
                                    <span className="font-semibold">
                                        Kembalian
                                    </span>

                                    <span className="font-bold">
                                        Rp{' '}
                                        {formatRupiah(
                                            transaction.change_amount
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}