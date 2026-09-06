<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated Users
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Admin Only
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {

        // Manajemen User
        Route::resource('users', UserController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');

        Route::get('/reports/export/excel', [ReportController::class, 'exportExcel'])
             ->name('reports.export.excel');
             Route::get('/reports/export/pdf', [ReportController::class, 'exportPdf'])
            ->name('reports.export.pdf');
        
        // Kategori
        Route::resource('categories', CategoryController::class)
            ->except(['create', 'edit', 'show']);

        // Produk
        Route::resource('products', ProductController::class)
            ->except(['create', 'edit', 'show']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Kasir
    |--------------------------------------------------------------------------
    */

    // Riwayat transaksi
    Route::get('/transactions/history', [TransactionController::class, 'history'])
        ->name('transactions.history');

    Route::get('/transactions/export/pdf', [TransactionController::class, 'exportPdf'])
    ->name('transactions.export.pdf');
    
    Route::get('/transactions/{transaction}/receipt', [TransactionController::class, 'receipt'])
    ->name('transactions.receipt');

    // Kasir / Transaksi
    Route::resource('transactions', TransactionController::class)
    ->except(['create', 'edit'])
    ->whereNumber('transaction');

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__.'/auth.php';