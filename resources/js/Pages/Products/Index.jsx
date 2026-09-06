import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const emptyForm = {
    category_id: '',
    name: '',
    sku: '',
    purchase_price: '',
    selling_price: '',
    stock: '',
};

export default function Index({ products, categories }) {
    const [editingId, setEditingId] = useState(null);

    const {
        data,
        setData,
        post,
        reset,
        processing,
        errors,
    } = useForm(emptyForm);

    const editForm = useForm(emptyForm);

    const inputClass =
        'mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm';

    function handleAdd(e) {
        e.preventDefault();

        post(route('products.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    }

    function startEdit(product) {
        setEditingId(product.id);

        editForm.setData({
            category_id: product.category_id ?? '',
            name: product.name ?? '',
            sku: product.sku ?? '',
            purchase_price: product.purchase_price ?? '',
            selling_price: product.selling_price ?? '',
            stock: product.stock ?? '',
        });
    }

    function cancelEdit() {
        setEditingId(null);
        editForm.reset();
        editForm.clearErrors();
    }

    function handleUpdate(e, id) {
        e.preventDefault();

        editForm.put(route('products.update', id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                editForm.reset();
            },
        });
    }

    function handleDelete(id) {
        if (!confirm('Yakin ingin menghapus produk ini?')) {
            return;
        }

        editForm.delete(route('products.destroy', id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Produk
                </h2>
            }
        >
            <Head title="Produk" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* =========================
                        FORM TAMBAH PRODUK
                    ========================== */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Tambah Produk
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Tambahkan produk baru ke dalam sistem.
                            </p>
                        </div>

                        <form
                            onSubmit={handleAdd}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {/* Nama */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nama Produk
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    SKU
                                </label>

                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    className={inputClass}
                                />

                                {errors.sku && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Kategori
                                </label>

                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData(
                                            'category_id',
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Pilih Kategori
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

                                {errors.category_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            {/* Harga Beli */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Harga Beli
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.purchase_price}
                                    onChange={(e) =>
                                        setData(
                                            'purchase_price',
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                />

                                {errors.purchase_price && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.purchase_price}
                                    </p>
                                )}
                            </div>

                            {/* Harga Jual */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Harga Jual
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.selling_price}
                                    onChange={(e) =>
                                        setData(
                                            'selling_price',
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                />

                                {errors.selling_price && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.selling_price}
                                    </p>
                                )}
                            </div>

                            {/* Stok */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Stok
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', e.target.value)
                                    }
                                    className={inputClass}
                                />

                                {errors.stock && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>

                            {/* Tombol */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menambahkan...'
                                        : 'Tambah Produk'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* =========================
                        DAFTAR PRODUK
                    ========================== */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="border-b border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Daftar Produk
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Kelola produk, harga, kategori, dan stok.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            No
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Nama
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            SKU
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Kategori
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Harga Jual
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Stok
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products.map((product, index) => {
                                        const isEditing =
                                            editingId === product.id;

                                        if (isEditing) {
                                            return (
                                                <tr key={product.id}>
                                                    <td
                                                        colSpan="7"
                                                        className="bg-gray-50 p-6"
                                                    >
                                                        <form
                                                            onSubmit={(e) =>
                                                                handleUpdate(
                                                                    e,
                                                                    product.id
                                                                )
                                                            }
                                                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                                        >
                                                            {/* Nama */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Nama Produk
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'name',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                />

                                                                {editForm.errors
                                                                    .name && (
                                                                    <p className="mt-1 text-xs text-red-600">
                                                                        {
                                                                            editForm
                                                                                .errors
                                                                                .name
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* SKU */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    SKU
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .sku
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'sku',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                />

                                                                {editForm.errors
                                                                    .sku && (
                                                                    <p className="mt-1 text-xs text-red-600">
                                                                        {
                                                                            editForm
                                                                                .errors
                                                                                .sku
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Kategori */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Kategori
                                                                </label>

                                                                <select
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .category_id
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'category_id',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Pilih
                                                                        Kategori
                                                                    </option>

                                                                    {categories.map(
                                                                        (
                                                                            category
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={
                                                                                    category.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>

                                                                {editForm.errors
                                                                    .category_id && (
                                                                    <p className="mt-1 text-xs text-red-600">
                                                                        {
                                                                            editForm
                                                                                .errors
                                                                                .category_id
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Harga Beli */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Harga Beli
                                                                </label>

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .purchase_price
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'purchase_price',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Harga Jual */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Harga Jual
                                                                </label>

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .selling_price
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'selling_price',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                />

                                                                {editForm.errors
                                                                    .selling_price && (
                                                                    <p className="mt-1 text-xs text-red-600">
                                                                        {
                                                                            editForm
                                                                                .errors
                                                                                .selling_price
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Stok */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Stok
                                                                </label>

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        editForm
                                                                            .data
                                                                            .stock
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editForm.setData(
                                                                            'stock',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Tombol */}
                                                            <div className="flex gap-2 md:col-span-2 lg:col-span-3">
                                                                <button
                                                                    type="submit"
                                                                    disabled={
                                                                        editForm.processing
                                                                    }
                                                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                                >
                                                                    {editForm.processing
                                                                        ? 'Menyimpan...'
                                                                        : 'Simpan'}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        cancelEdit
                                                                    }
                                                                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                                    {product.name}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {product.sku}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {product.category?.name ??
                                                        '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-800">
                                                    Rp{' '}
                                                    {Number(
                                                        product.selling_price
                                                    ).toLocaleString('id-ID')}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                                                    <span
                                                        className={
                                                            product.stock <= 5
                                                                ? 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700'
                                                                : 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700'
                                                        }
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEdit(
                                                                    product
                                                                )
                                                            }
                                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {products.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                Belum ada produk.
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