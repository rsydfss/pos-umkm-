import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function formatRupiah(value) {
    return 'Rp ' + Number(value ?? 0).toLocaleString('id-ID');
}

export default function Index({ products }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState('');

    const total = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }, [cart]);

    const change = Math.max(
        0,
        Number(paidAmount || 0) - total
    );

    const categories = useMemo(() => {
        return [
            ...new Map(
                products
                    .filter((product) => product.category)
                    .map((product) => [
                        product.category.id,
                        product.category,
                    ])
            ).values(),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const keyword = search.toLowerCase().trim();

            const matchesSearch =
                product.name.toLowerCase().includes(keyword) ||
                product.sku.toLowerCase().includes(keyword);

            const matchesCategory =
                selectedCategory === '' ||
                product.category?.id === Number(selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const { data, setData, post, processing, errors } = useForm({
        items: [],
        payment_method: 'cash',
        paid_amount: '',
    });

    const addToCart = (product) => {
        if (product.stock <= 0) {
            return;
        }

        setCart((current) => {
            const existing = current.find(
                (item) => item.id === product.id
            );

            if (existing) {
                if (existing.quantity >= product.stock) {
                    return current;
                }

                return current.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                          }
                        : item
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.selling_price),
                    stock: product.stock,
                    quantity: 1,
                },
            ];
        });
    };

    const updateQuantity = (id, quantity) => {
        setCart((current) =>
            current.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const newQuantity = Math.min(
                    Math.max(1, quantity),
                    item.stock
                );

                return {
                    ...item,
                    quantity: newQuantity,
                };
            })
        );
    };

    const removeFromCart = (id) => {
        setCart((current) =>
            current.filter((item) => item.id !== id)
        );
    };

    const submit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Keranjang masih kosong.');
            return;
        }

        if (Number(paidAmount) < total) {
            alert('Nominal pembayaran kurang.');
            return;
        }

        setData({
            items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
            payment_method: paymentMethod,
            paid_amount: Number(paidAmount),
        });

        post(route('transactions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setCart([]);
                setPaidAmount('');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Kasir
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Pilih produk dan proses transaksi pelanggan
                    </p>
                </div>
            }
        >
            <Head title="Kasir" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* =========================
                            PRODUK
                        ========================== */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">

                                {/* Header Produk */}
                                <div className="border-b border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Daftar Produk
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Klik produk untuk menambahkan ke keranjang
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600">
                                            {filteredProducts.length} produk
                                        </div>
                                    </div>

                                    {/* Search */}
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                        <div className="relative">
                                            <svg
                                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                                                />
                                            </svg>

                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="Cari nama produk atau SKU..."
                                                className="w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <select
                                            value={selectedCategory}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Semua Kategori
                                            </option>

                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Produk */}
                                <div className="p-6">
                                    {filteredProducts.length === 0 ? (
                                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                            <div className="text-center">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                                    <svg
                                                        className="h-6 w-6 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                                                        />
                                                    </svg>
                                                </div>

                                                <p className="mt-3 font-medium text-gray-600">
                                                    Produk tidak ditemukan
                                                </p>

                                                <p className="mt-1 text-sm text-gray-400">
                                                    Coba gunakan kata kunci lain.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                            {filteredProducts.map((product) => {
                                                const isOutOfStock =
                                                    product.stock <= 0;

                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        disabled={isOutOfStock}
                                                        onClick={() =>
                                                            addToCart(product)
                                                        }
                                                        className={`group rounded-xl border p-4 text-left transition ${
                                                            isOutOfStock
                                                                ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                                                                : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <h4 className="truncate font-semibold text-gray-900">
                                                                    {product.name}
                                                                </h4>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    SKU: {product.sku}
                                                                </p>
                                                            </div>

                                                            <span
                                                                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                                                                    isOutOfStock
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : product.stock <= 5
                                                                          ? 'bg-amber-100 text-amber-700'
                                                                          : 'bg-emerald-100 text-emerald-700'
                                                                }`}
                                                            >
                                                                {isOutOfStock
                                                                    ? 'Habis'
                                                                    : `${product.stock} stok`}
                                                            </span>
                                                        </div>

                                                        <div className="mt-5">
                                                            <p className="text-lg font-bold text-indigo-600">
                                                                {formatRupiah(
                                                                    product.selling_price
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {product.category?.name ??
                                                                    'Tanpa kategori'}
                                                            </p>
                                                        </div>

                                                        {!isOutOfStock && (
                                                            <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs font-medium text-gray-500 group-hover:text-indigo-600">
                                                                + Tambahkan ke keranjang
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =========================
                            KERANJANG
                        ========================== */}
                        <div>
                            <div className="sticky top-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">

                                {/* Header Keranjang */}
                                <div className="border-b border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Keranjang
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {cart.length === 0
                                                    ? 'Belum ada produk'
                                                    : `${cart.length} jenis produk`}
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
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2 2h12m-9 4a1 1 0 1 0 2 0m6 0a1 1 0 1 0 2 0"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Isi Keranjang */}
                                <div className="max-h-[420px] overflow-y-auto p-6">
                                    {cart.length === 0 ? (
                                        <div className="flex min-h-[220px] items-center justify-center">
                                            <div className="text-center">
                                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                    <svg
                                                        className="h-7 w-7 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2 2h12"
                                                        />
                                                    </svg>
                                                </div>

                                                <p className="mt-3 font-medium text-gray-600">
                                                    Keranjang kosong
                                                </p>

                                                <p className="mt-1 text-sm text-gray-400">
                                                    Pilih produk untuk memulai transaksi.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-lg border border-gray-100 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium text-gray-900">
                                                                {item.name}
                                                            </p>

                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {formatRupiah(item.price)}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            }
                                                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                            title="Hapus produk"
                                                        >
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
                                                                    d="M6 18 18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center rounded-lg border border-gray-200">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity <=
                                                                    1
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center text-lg text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                −
                                                            </button>

                                                            <span className="flex h-9 min-w-9 items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold">
                                                                {item.quantity}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >=
                                                                    item.stock
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center text-lg text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <p className="font-semibold text-gray-900">
                                                            {formatRupiah(
                                                                item.price *
                                                                    item.quantity
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Pembayaran */}
                                <div className="border-t border-gray-100 p-6">

                                    {/* Total */}
                                    <div className="rounded-xl bg-gray-900 p-5 text-white">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-300">
                                                Total Pembayaran
                                            </span>

                                            <span className="text-2xl font-bold">
                                                {formatRupiah(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={submit}
                                        className="mt-5 space-y-4"
                                    >
                                        {/* Metode */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Metode Pembayaran
                                            </label>

                                            <select
                                                value={paymentMethod}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1.5 w-full rounded-lg border-gray-300 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="cash">
                                                    Cash
                                                </option>

                                                <option value="transfer">
                                                    Transfer
                                                </option>

                                                <option value="qris">
                                                    QRIS
                                                </option>
                                            </select>
                                        </div>

                                        {/* Uang Dibayar */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Uang Dibayar
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={paidAmount}
                                                onChange={(e) =>
                                                    setPaidAmount(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nominal pembayaran"
                                                className="mt-1.5 w-full rounded-lg border-gray-300 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Kembalian */}
                                        <div
                                            className={`rounded-lg p-4 ${
                                                Number(paidAmount) >= total &&
                                                total > 0
                                                    ? 'bg-emerald-50'
                                                    : 'bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Kembalian
                                                </span>

                                                <span
                                                    className={`font-bold ${
                                                        Number(paidAmount) >=
                                                            total &&
                                                        total > 0
                                                            ? 'text-emerald-600'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {formatRupiah(change)}
                                                </span>
                                            </div>
                                        </div>

                                        {errors.items && (
                                            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                                {errors.items}
                                            </p>
                                        )}

                                        {/* Tombol */}
                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                cart.length === 0
                                            }
                                            className="w-full rounded-lg bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Memproses transaksi...'
                                                : 'Proses Transaksi'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}