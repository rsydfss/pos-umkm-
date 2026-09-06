import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({
        name: '',
    });

    const editForm = useForm({
        name: '',
    });

    function handleAdd(e) {
        e.preventDefault();

        createForm.post(route('categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
            },
        });
    }

    function startEdit(category) {
        setEditingId(category.id);

        editForm.clearErrors();
        editForm.setData('name', category.name);
    }

    function cancelEdit() {
        setEditingId(null);
        editForm.reset();
        editForm.clearErrors();
    }

    function handleUpdate(e, id) {
        e.preventDefault();

        editForm.put(route('categories.update', id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                editForm.reset();
            },
        });
    }

    function handleDelete(category) {
        if (!confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) {
            return;
        }

        router.delete(route('categories.destroy', category.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Kategori Produk
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola kategori produk yang tersedia di sistem.
                    </p>
                </div>
            }
        >
            <Head title="Kategori Produk" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Form Tambah */}
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Tambah Kategori
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Tambahkan kategori baru untuk mengelompokkan produk.
                            </p>
                        </div>

                        <form
                            onSubmit={handleAdd}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: Makanan, Minuman, Sembako..."
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {createForm.errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {createForm.processing
                                    ? 'Menambahkan...'
                                    : 'Tambah Kategori'}
                            </button>
                        </form>
                    </div>

                    {/* Daftar Kategori */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Daftar Kategori
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {categories.length} kategori tersedia
                                    </p>
                                </div>

                                <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                                    {categories.length}
                                </div>
                            </div>
                        </div>

                        {categories.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                                        />
                                    </svg>
                                </div>

                                <p className="font-medium text-gray-700">
                                    Belum ada kategori
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Tambahkan kategori menggunakan form di atas.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {categories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className="px-6 py-4 transition hover:bg-gray-50"
                                    >
                                        {editingId === category.id ? (
                                            /* Mode Edit */
                                            <form
                                                onSubmit={(e) =>
                                                    handleUpdate(
                                                        e,
                                                        category.id
                                                    )
                                                }
                                                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                                            >
                                                <div className="flex flex-1 items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                                                        {index + 1}
                                                    </div>

                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={
                                                                editForm.data
                                                                    .name
                                                            }
                                                            onChange={(e) =>
                                                                editForm.setData(
                                                                    'name',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            autoFocus
                                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />

                                                        {editForm.errors.name && (
                                                            <p className="mt-2 text-sm text-red-600">
                                                                {
                                                                    editForm
                                                                        .errors
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 sm:pt-0">
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            editForm.processing
                                                        }
                                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                    >
                                                        {editForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan'}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Mode Normal */
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                                                        {index + 1}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-gray-800">
                                                            {category.name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-gray-400">
                                                            ID: #{category.id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEdit(category)
                                                        }
                                                        className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}