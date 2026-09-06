import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
            const keyword = search.toLowerCase();

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
            current
                .map((item) => {
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Kasir
                </h2>
            }
        >
            <Head title="Kasir" />

<div className="py-6">
    <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3">
        {/* Produk */}
        <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold">
                    Produk
                </h3>

                {/* Pencarian & Filter */}
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama produk atau SKU..."
                        className="w-full rounded-md border-gray-300"
                    />

                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                        className="w-full rounded-md border-gray-300"
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

                    {/* Daftar Produk */}
                    {filteredProducts.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                            Produk tidak ditemukan.
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => addToCart(product)}
                                    className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
                                >
                                    <div className="font-semibold">
                                        {product.name}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-500">
                                        SKU: {product.sku}
                                    </div>

                                    <div className="mt-2 font-bold">
                                        Rp{' '}
                                        {Number(
                                            product.selling_price
                                        ).toLocaleString('id-ID')}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-500">
                                        Kategori:{' '}
                                        {product.category?.name ?? '-'}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-500">
                                        Stok: {product.stock}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

                    {/* Keranjang */}
                    <div>
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">
                                Keranjang
                            </h3>

                            {cart.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    Belum ada produk.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border-b pb-4"
                                        >
                                            <div className="font-medium">
                                                {item.name}
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        className="rounded border px-2"
                                                    >
                                                        -
                                                    </button>

                                                    <span>
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
                                                        className="rounded border px-2"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id
                                                        )
                                                    }
                                                    className="text-sm text-red-600"
                                                >
                                                    Hapus
                                                </button>
                                            </div>

                                            <div className="mt-2 text-right font-semibold">
                                                Rp{' '}
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    'id-ID'
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>
                                        Rp{' '}
                                        {total.toLocaleString(
                                            'id-ID'
                                        )}
                                    </span>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="mt-5 space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Metode Pembayaran
                                        </label>

                                        <select
                                            value={paymentMethod}
                                            onChange={(e) =>
                                                setPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-md border-gray-300"
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
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
                                            className="mt-1 w-full rounded-md border-gray-300"
                                        />
                                    </div>

                                    <div className="rounded-md bg-gray-100 p-3">
                                        <div className="flex justify-between font-semibold">
                                            <span>Kembalian</span>
                                            <span>
                                                Rp{' '}
                                                {change.toLocaleString(
                                                    'id-ID'
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {errors.items && (
                                        <p className="text-sm text-red-600">
                                            {errors.items}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            cart.length === 0
                                        }
                                        className="w-full rounded-md bg-gray-800 px-4 py-3 font-semibold text-white disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : 'Proses Transaksi'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}