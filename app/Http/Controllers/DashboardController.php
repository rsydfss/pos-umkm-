<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $todayTotal = Transaction::whereDate('created_at', today())
            ->sum('total');

        $monthTotal = Transaction::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total');

        $todayTransactions = Transaction::whereDate(
            'created_at',
            today()
        )->count();

        $totalProducts = Product::count();

        $lowStockProducts = Product::where('stock', '<=', 5)
            ->orderBy('stock')
            ->get();

        $salesTrend = Transaction::selectRaw(
            'DATE(created_at) as date, SUM(total) as total'
        )
            ->where(
                'created_at',
                '>=',
                now()->subDays(6)->startOfDay()
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = TransactionItem::select(
            'product_id',
            DB::raw('SUM(quantity) as total_terjual')
        )
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get();

        $recentTransactions = Transaction::with('user:id,name')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'todayTotal'        => $todayTotal,
            'monthTotal'        => $monthTotal,
            'todayTransactions' => $todayTransactions,
            'totalProducts'     => $totalProducts,
            'lowStockProducts'  => $lowStockProducts,
            'salesTrend'        => $salesTrend,
            'topProducts'       => $topProducts,
            'recentTransactions'=> $recentTransactions,
        ]);
    }
}