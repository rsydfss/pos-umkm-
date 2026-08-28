import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const { data, setData, post, reset, processing, errors } = useForm({ name: '' });
    const [editingId, setEditingId] = useState(null);
    const editForm = useForm({ name: '' });

    function handleAdd(e) {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => reset(),
        });
    }

    function startEdit(category) {
        setEditingId(category.id);
        editForm.clearErrors();
        editForm.setData('name', category.name);
    }

    function handleUpdate(e, id) {
        e.preventDefault();
        editForm.put(route('categories.update', id), {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete(id) {
        if (confirm('Yakin hapus kategori ini?')) {
            router.delete(route('categories.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Kategori Produk</h2>}>
            <Head title="Kategori" />

            <div className="py-8 max-w-2xl mx-auto sm:px-6">
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama kategori baru"
                        className="border-gray-300 rounded-md shadow-sm flex-1"
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Tambah
                    </button>
                </form>
                {errors.name && <p className="text-red-600 text-sm mb-4">{errors.name}</p>}

                <div className="bg-white shadow rounded-lg divide-y">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4">
                            {editingId === category.id ? (
                                <form onSubmit={(e) => handleUpdate(e, category.id)} className="flex flex-col gap-1 flex-1">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="border-gray-300 rounded-md shadow-sm flex-1"
                                        />
                                        <button type="submit" disabled={editForm.processing} className="text-green-600 font-medium">Simpan</button>
                                        <button type="button" onClick={() => setEditingId(null)} className="text-gray-500">Batal</button>
                                    </div>
                                    {editForm.errors.name && (
                                        <p className="text-red-600 text-sm">{editForm.errors.name}</p>
                                    )}
                                </form>
                            ) : (
                                <>
                                    <span>{category.name}</span>
                                    <div className="flex gap-3">
                                        <button onClick={() => startEdit(category)} className="text-indigo-600">Edit</button>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600">Hapus</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="p-4 text-gray-500">Belum ada kategori.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}