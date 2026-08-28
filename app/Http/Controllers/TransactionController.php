<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Transactions/Index', [
            'products' => Product::with('category')
                ->where('stock', '>', 0)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'in:cash,transfer,qris'],
            'paid_amount' => ['required', 'numeric', 'min:0'],
        ]);


        DB::transaction(function () use ($validated) {
            $total = 0;
            $items = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception(
                        "Stok {$product->name} tidak mencukupi."
                    );
                }

                $price = $product->selling_price;
                $subtotal = $price * $item['quantity'];

                $total += $subtotal;

                $items[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal,
                ];
            }

            if ($validated['paid_amount'] < $total) {
                throw new \Exception(
                    'Nominal pembayaran kurang dari total transaksi.'
                );
            }

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'paid_amount' => $validated['paid_amount'],
                'change_amount' => $validated['paid_amount'] - $total,
            ]);

            foreach ($items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);

                $item['product']->decrement(
                    'stock',
                    $item['quantity']
                );
            }
        });

        return redirect()
            ->route('transactions.index')
            ->with('success', 'Transaksi berhasil disimpan.');
    }
    public function history()
    {
        $transactions = Transaction::with('user')
            ->latest()
            ->get();

        return Inertia::render('Transactions/History', [
            'transactions' => $transactions,
        ]);
    }
    public function show(Transaction $transaction)
    {
        $transaction->load([
            'user',
            'items.product',
        ]);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }
}