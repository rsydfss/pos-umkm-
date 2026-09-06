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
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    {/* Informasi Transaksi */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Informasi Transaksi
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* Nomor */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Nomor Transaksi
                                </p>

                                <p className="font-medium text-gray-800">
                                    #{transaction.id}
                                </p>
                            </div>

                            {/* Tanggal */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Tanggal
                                </p>

                                <p className="font-medium text-gray-800">
                                    {formatDate(transaction.created_at)}
                                </p>
                            </div>

                            {/* Kasir */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Kasir
                                </p>

                                <p className="font-medium text-gray-800">
                                    {transaction.user?.name ?? '-'}
                                </p>
                            </div>

                            {/* Pembayaran */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Metode Pembayaran
                                </p>

                                <p className="font-medium capitalize text-gray-800">
                                    {transaction.payment_method}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Produk */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">

                        <div className="border-b border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Detail Produk
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

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {transaction.items.map((item) => (
                                        <tr key={item.id}>

                                            {/* Produk */}
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {item.product?.name ?? '-'}
                                            </td>

                                            {/* Qty */}
                                            <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                {item.quantity}
                                            </td>

                                            {/* Harga */}
                                            <td className="px-6 py-4 text-right text-sm text-gray-700">
                                                Rp {formatRupiah(item.price)}
                                            </td>

                                            {/* Subtotal */}
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                                                Rp {formatRupiah(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Ringkasan Pembayaran */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="ml-auto max-w-sm space-y-2">

                                {/* Total */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Total
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        Rp {formatRupiah(transaction.total)}
                                    </span>
                                </div>

                                {/* Dibayar */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Dibayar
                                    </span>

                                    <span className="text-gray-800">
                                        Rp{' '}
                                        {formatRupiah(
                                            transaction.paid_amount
                                        )}
                                    </span>
                                </div>

                                {/* Kembalian */}
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-medium text-gray-700">
                                        Kembalian
                                    </span>

                                    <span className="font-bold text-gray-800">
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