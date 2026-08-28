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
    const { data, setData, post, reset, processing, errors } = useForm(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const editForm = useForm(emptyForm);

    function handleAdd(e) {
        e.preventDefault();
        post(route('products.store'), { onSuccess: () => reset() });
    }

    function startEdit(product) {
        setEditingId(product.id);
        editForm.setData({
            category_id: product.category_id,
            name: product.name,
            sku: product.sku,
            purchase_price: product.purchase_price,
            selling_price: product.selling_price,
            stock: product.stock,
        });
    }

    function handleUpdate(e, id) {
        e.preventDefault();
        editForm.put(route('products.update', id), {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete(id) {
        if (confirm('Yakin hapus produk ini?')) {
            editForm.delete(route('products.destroy', id));
        }
    }

    const inputClass = "border-gray-300 rounded-md shadow-sm w-full text-sm";

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Produk</h2>}>
            <Head title="Produk" />

            <div className="py-8 max-w-5xl mx-auto sm:px-6">
                <form onSubmit={handleAdd} className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                    <div className="col-span-2">
                        <label className="text-xs text-gray-500">Nama Produk</label>
                        <input className={inputClass} value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">SKU</label>
                        <input className={inputClass} value={data.sku} onChange={e => setData('sku', e.target.value)} />
                        {errors.sku && <p className="text-red-600 text-xs">{errors.sku}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Kategori</label>
                        <select className={inputClass} value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                            <option value="">Pilih</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.category_id && <p className="text-red-600 text-xs">{errors.category_id}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Harga Beli</label>
                        <input type="number" className={inputClass} value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Harga Jual</label>
                        <input type="number" className={inputClass} value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} />
                        {errors.selling_price && <p className="text-red-600 text-xs">{errors.selling_price}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Stok</label>
                        <input type="number" className={inputClass} value={data.stock} onChange={e => setData('stock', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="col-span-2 md:col-span-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                        Tambah Produk
                    </button>
                </form>

                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-3">Nama</th>
                                <th className="p-3">SKU</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Harga Jual</th>
                                <th className="p-3">Stok</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map(product => (
                                editingId === product.id ? (
                                    <tr key={product.id}>
                                        <td colSpan={6} className="p-3">
                                            <form onSubmit={e => handleUpdate(e, product.id)} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
                                                <input className={inputClass} value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                                                <input className={inputClass} value={editForm.data.sku} onChange={e => editForm.setData('sku', e.target.value)} />
                                                <select className={inputClass} value={editForm.data.category_id} onChange={e => editForm.setData('category_id', e.target.value)}>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                <input type="number" className={inputClass} value={editForm.data.purchase_price} onChange={e => editForm.setData('purchase_price', e.target.value)} />
                                                <input type="number" className={inputClass} value={editForm.data.selling_price} onChange={e => editForm.setData('selling_price', e.target.value)} />
                                                <input type="number" className={inputClass} value={editForm.data.stock} onChange={e => editForm.setData('stock', e.target.value)} />
                                                <div className="col-span-2 md:col-span-6 flex gap-3">
                                                    <button type="submit" className="text-green-600 text-sm font-medium">Simpan</button>
                                                    <button type="button" onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Batal</button>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={product.id}>
                                        <td className="p-3">{product.name}</td>
                                        <td className="p-3">{product.sku}</td>
                                        <td className="p-3">{product.category?.name}</td>
                                        <td className="p-3">Rp {Number(product.selling_price).toLocaleString('id-ID')}</td>
                                        <td className="p-3">{product.stock}</td>
                                        <td className="p-3 flex gap-3">
                                            <button onClick={() => startEdit(product)} className="text-indigo-600">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600">Hapus</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                            {products.length === 0 && (
                                <tr><td colSpan={6} className="p-4 text-gray-500 text-center">Belum ada produk.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}