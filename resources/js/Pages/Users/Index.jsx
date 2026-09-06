import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users }) {
    const [editingUser, setEditingUser] = useState(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'kasir',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'kasir',
    });

    const submitCreate = (e) => {
        e.preventDefault();

        createForm.post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                createForm.setData('role', 'kasir');
            },
        });
    };

    const startEdit = (user) => {
        setEditingUser(user);

        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        editForm.reset();
    };

    const submitEdit = (e) => {
        e.preventDefault();

        editForm.put(route('users.update', editingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const deleteUser = (user) => {
        if (!confirm(`Hapus user "${user.name}"?`)) {
            return;
        }

        createForm.delete(route('users.destroy', user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manajemen User
                </h2>
            }
        >
            <Head title="Manajemen User" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Form */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">
                            {editingUser ? 'Edit User' : 'Tambah User'}
                        </h3>

                        <form
                            onSubmit={
                                editingUser
                                    ? submitEdit
                                    : submitCreate
                            }
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nama
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editingUser
                                            ? editForm.data.name
                                            : createForm.data.name
                                    }
                                    onChange={(e) =>
                                        editingUser
                                            ? editForm.setData(
                                                  'name',
                                                  e.target.value
                                              )
                                            : createForm.setData(
                                                  'name',
                                                  e.target.value
                                              )
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                    required
                                />

                                {(editingUser
                                    ? editForm.errors.name
                                    : createForm.errors.name) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editingUser
                                            ? editForm.errors.name
                                            : createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={
                                        editingUser
                                            ? editForm.data.email
                                            : createForm.data.email
                                    }
                                    onChange={(e) =>
                                        editingUser
                                            ? editForm.setData(
                                                  'email',
                                                  e.target.value
                                              )
                                            : createForm.setData(
                                                  'email',
                                                  e.target.value
                                              )
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                    required
                                />

                                {(editingUser
                                    ? editForm.errors.email
                                    : createForm.errors.email) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editingUser
                                            ? editForm.errors.email
                                            : createForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={
                                        editingUser
                                            ? editForm.data.password
                                            : createForm.data.password
                                    }
                                    onChange={(e) =>
                                        editingUser
                                            ? editForm.setData(
                                                  'password',
                                                  e.target.value
                                              )
                                            : createForm.setData(
                                                  'password',
                                                  e.target.value
                                              )
                                    }
                                    placeholder={
                                        editingUser
                                            ? 'Kosongkan jika tidak diubah'
                                            : ''
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                    required={!editingUser}
                                />

                                {(editingUser
                                    ? editForm.errors.password
                                    : createForm.errors.password) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editingUser
                                            ? editForm.errors.password
                                            : createForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Role
                                </label>

                                <select
                                    value={
                                        editingUser
                                            ? editForm.data.role
                                            : createForm.data.role
                                    }
                                    onChange={(e) =>
                                        editingUser
                                            ? editForm.setData(
                                                  'role',
                                                  e.target.value
                                              )
                                            : createForm.setData(
                                                  'role',
                                                  e.target.value
                                              )
                                    }
                                    className="mt-1 w-full rounded-md border-gray-300"
                                >
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-2 md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={
                                        editingUser
                                            ? editForm.processing
                                            : createForm.processing
                                    }
                                    className="rounded-md bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {editingUser
                                        ? editForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'
                                        : createForm.processing
                                          ? 'Menambahkan...'
                                          : 'Tambah User'}
                                </button>

                                {editingUser && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Daftar User */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="border-b p-6">
                            <h3 className="text-lg font-semibold">
                                Daftar User
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                            No
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                            Nama
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                            Email
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                            Role
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 text-sm">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium">
                                                {user.name}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={
                                                        user.role === 'admin'
                                                            ? 'rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700'
                                                            : 'rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'
                                                    }
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
    <div className="flex justify-end gap-2">
        <button
            type="button"
            onClick={() => startEdit(user)}
            className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
        >
            Edit
        </button>

        <button
            type="button"
            onClick={() => deleteUser(user)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
        >
            Hapus
        </button>
    </div>
</td>
                                        </tr>
                                    ))}

                                    {users.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Belum ada user.
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