import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ transaction }) {
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
                    Struk Transaksi
                </h2>
            }
        >
            <Head title={`Struk Transaksi #${transaction.id}`} />

            <div className="py-6">
                <div className="mx-auto max-w-md px-4">
                    <div className="rounded-lg bg-white p-6 shadow">

                        <div className="text-center">
                            <h1 className="text-xl font-bold">
                                POS UMKM
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Struk Transaksi
                            </p>
                        </div>

                        <div className="my-5 border-t border-dashed" />

                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>No. Transaksi</span>
                                <span className="font-medium">
                                    #{transaction.id}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tanggal</span>
                                <span>
                                    {formatDate(transaction.created_at)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Kasir</span>
                                <span>
                                    {transaction.user?.name ?? '-'}
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-dashed" />

                        <div className="space-y-4">
                            {transaction.items.map((item) => (
                                <div key={item.id}>
                                    <div className="font-medium">
                                        {item.product?.name ?? '-'}
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>
                                            {item.quantity} x Rp{' '}
                                            {formatRupiah(item.price)}
                                        </span>

                                        <span>
                                            Rp{' '}
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="my-5 border-t border-dashed" />

                        <div className="space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>
                                    Rp {formatRupiah(transaction.total)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span>Dibayar</span>
                                <span>
                                    Rp {formatRupiah(transaction.paid_amount)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span>Kembalian</span>
                                <span>
                                    Rp {formatRupiah(transaction.change_amount)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span>Pembayaran</span>
                                <span className="capitalize">
                                    {transaction.payment_method}
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-dashed" />

                        <p className="text-center text-sm text-gray-500">
                            Terima kasih telah berbelanja.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <Link
                                href={route('transactions.index')}
                                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-300"
                            >
                                Kembali ke Kasir
                            </Link>

                            <Link
                                href={route('transactions.history')}
                                className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                            >
                                Riwayat
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}