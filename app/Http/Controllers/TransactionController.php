<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\StockMovement;
use Barryvdh\DomPDF\Facade\Pdf; 
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


        $transaction = DB::transaction(function () use ($validated) {
            $total = 0;
            $items = [];

            // proses produk...

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

                $product = $item['product'];

                $stockBefore = $product->stock;

                $product->decrement(
                    'stock',
                    $item['quantity']
                );

                $product->refresh();

                StockMovement::create([
                    'product_id'   => $product->id,
                    'user_id'      => auth()->id(),
                    'quantity'     => -$item['quantity'],
                    'stock_before' => $stockBefore,
                    'stock_after'  => $product->stock,
                    'type'         => 'sale',
                    'note'         => 'Stok berkurang karena transaksi',
                ]);
            }

            return $transaction;
        });

            return redirect()
    ->route('transactions.receipt', $transaction->id)
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
        public function receipt(Transaction $transaction)
    {
        $transaction->load([
            'user',
            'items.product',
        ]);

        return Inertia::render('Transactions/Receipt', [
            'transaction' => $transaction,
        ]);
    }
    public function exportPdf(Request $request)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $query = Transaction::with('user')
            ->latest();

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $transactions = $query->get();

        $total = $transactions->sum('total');

        $pdf = Pdf::loadView('exports.transactions-pdf', [
            'transactions' => $transactions,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'total' => $total,
        ]);

        return $pdf->download('laporan-transaksi.pdf');
    }
}