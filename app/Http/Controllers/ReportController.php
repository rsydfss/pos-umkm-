<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input(
            'start_date',
            now()->startOfMonth()->toDateString()
        );

        $endDate = $request->input(
            'end_date',
            now()->toDateString()
        );

        $transactions = Transaction::with('user:id,name')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->latest()
            ->get();

        $totalRevenue = $transactions->sum('total');

        $totalTransactions = $transactions->count();

        $totalItems = TransactionItem::whereIn(
            'transaction_id',
            $transactions->pluck('id')
        )->sum('quantity');

        $paymentSummary = $transactions
            ->groupBy('payment_method')
            ->map(function ($items, $method) {
                return [
                    'payment_method' => $method,
                    'total' => $items->sum('total'),
                    'count' => $items->count(),
                ];
            })
            ->values();

        $topProducts = TransactionItem::select(
                'product_id',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(subtotal) as total_sales')
            )
            ->with('product:id,name')
            ->whereIn(
                'transaction_id',
                $transactions->pluck('id')
            )
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/Index', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'transactions' => $transactions,
            'totalRevenue' => $totalRevenue,
            'totalTransactions' => $totalTransactions,
            'totalItems' => $totalItems,
            'paymentSummary' => $paymentSummary,
            'topProducts' => $topProducts,
        ]);
    }
        public function exportExcel(Request $request)
    {
        $startDate = $request->input(
            'start_date',
            now()->startOfMonth()->toDateString()
        );

        $endDate = $request->input(
            'end_date',
            now()->toDateString()
        );

        return Excel::download(
            new TransactionsExport($startDate, $endDate),
            'laporan-penjualan-' . $startDate . '-sampai-' . $endDate . '.xlsx'
        );
    }
    public function exportPdf(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

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

    $pdf = Pdf::loadView('exports.pdf', [
        'transactions' => $transactions,
        'startDate' => $startDate,
        'endDate' => $endDate,
        'total' => $total,
    ]);

    return $pdf->download('laporan-transaksi.pdf');
}   
}