<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection(): Enumerable
    {
        return Transaction::with('user')
            ->whereDate('created_at', '>=', $this->startDate)
            ->whereDate('created_at', '<=', $this->endDate)
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID Transaksi',
            'Tanggal',
            'Kasir',
            'Metode Pembayaran',
            'Total',
            'Dibayar',
            'Kembalian',
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->id,
            $transaction->created_at->format('d-m-Y H:i'),
            $transaction->user?->name ?? '-',
            strtoupper($transaction->payment_method),
            $transaction->total,
            $transaction->paid_amount,
            $transaction->change_amount,
        ];
    }
}